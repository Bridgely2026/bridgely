import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

// Real RAG pipeline for Debrief: embed the user's description (+ an optional
// follow-up), retrieve the closest taxonomy entries via pgvector, and either
// ask one clarifying follow-up, decline with a logged gap, or generate a
// grounded structured answer with Claude.
//
// Assumes a `taxonomy_entries` table and a `match_taxonomy_entries(query_embedding,
// match_count)` RPC (returning norm_id, category, definition, surface_markers,
// what_it_means, example, good_response, similarity) and a `debrief_gaps` table,
// per bridgely_rag_schema.sql (applied separately, not part of this repo).

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const VOYAGE_MODEL = "voyage-3";
const CLAUDE_MODEL = "claude-sonnet-5";

// Similarity thresholds on Voyage's cosine-similarity scale. Calibrated from
// a small manual test batch (2026-09-18): a clear, unambiguous match (landlord
// boiler description -> HL-1) scored 0.41, while genuinely unrelated content
// (pet care) scored 0.15-0.22 against all four entries. Still a small sample —
// will likely need further tuning once there's real usage data.
const CONFIDENT_THRESHOLD = 0.35;
const FLOOR_THRESHOLD = 0.25;

// Intentionally simple rate limiter: in-memory, per-instance, and it resets on
// redeploy or cold start (and isn't shared between serverless instances). That's
// enough to stop a quiet demo from being hammered by accident, but it is NOT a
// substitute for real distributed rate limiting (e.g. Upstash) if this ever
// gets genuinely public traffic.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_SWEEP_THRESHOLD = 1000; // sweep idle IPs once the map gets this big

const requestLog = new Map<string, number[]>();

function getClientKey(request: NextRequest): string {
  // Vercel sets x-forwarded-for reliably in production; the first entry is the client.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}

// Returns true if this request is allowed (and records it), false if the client
// is over the limit. Fully synchronous, so concurrent requests can't race past it.
function checkRateLimit(key: string, now: number): boolean {
  if (requestLog.size > RATE_LIMIT_SWEEP_THRESHOLD) {
    for (const [k, stamps] of requestLog) {
      if (stamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(k);
    }
  }

  const recent = (requestLog.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, recent);
    return false;
  }
  recent.push(now);
  requestLog.set(key, recent);
  return true;
}

type FollowUp = { question: string; answer: string };

type MatchRow = {
  norm_id: string;
  category: string;
  definition: string;
  surface_markers: string;
  what_it_means: string;
  example: string;
  good_response: string;
  similarity: number;
};

type DebriefResult = {
  likely_norm: string;
  surface_signal: string;
  what_it_means: string;
  suggested_response: string;
};

type GroundedOutcome = { applies: true; result: DebriefResult } | { applies: false };

// Why a debrief was logged to debrief_gaps: nothing was even close, vs.
// retrieval got close but Claude confirmed the entry doesn't fit (the stronger
// signal that a new taxonomy entry is needed for this exact situation).
type DeclineReason = "below_floor_threshold" | "entry_did_not_apply";

const NO_MATCH_MESSAGE =
  "I couldn't find a close match for this one yet — it may be outside what Bridgely covers so far, but thanks for flagging it.";

const FOLLOW_UP_TOOL: Anthropic.Tool = {
  name: "ask_clarifying_question",
  description: "Ask exactly one short clarifying question to help disambiguate between candidate norms.",
  input_schema: {
    type: "object",
    properties: {
      question: { type: "string", description: "A single short, natural clarifying question for the user." },
    },
    required: ["question"],
  },
};

const DEBRIEF_TOOL: Anthropic.Tool = {
  name: "provide_debrief_result",
  description: "Return the structured debrief result, grounded strictly in the provided taxonomy entry.",
  input_schema: {
    type: "object",
    properties: {
      entry_applies: {
        type: "boolean",
        description:
          "true only if the retrieved taxonomy entry genuinely explains the situation described; false if it's the closest match found but doesn't actually fit — never force what_it_means/suggested_response to describe a pattern that doesn't apply.",
      },
      likely_norm: { type: "string", description: "The norm_id of the matched taxonomy entry, verbatim." },
      surface_signal: {
        type: "string",
        description: "The surface-level phrase or behavior the user described that triggered the mismatch.",
      },
      what_it_means: {
        type: "string",
        description: "What it actually means, grounded strictly in the provided taxonomy entry.",
      },
      suggested_response: {
        type: "string",
        description: "A suggested response, grounded strictly in the provided taxonomy entry.",
      },
    },
    required: ["entry_applies", "likely_norm", "surface_signal", "what_it_means", "suggested_response"],
  },
};

function getClients() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !VOYAGE_API_KEY || !ANTHROPIC_API_KEY) {
    throw new Error(
      "Missing one or more required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VOYAGE_API_KEY, ANTHROPIC_API_KEY"
    );
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  return { supabase, anthropic };
}

async function embedQuery(text: string): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: [text], model: VOYAGE_MODEL, input_type: "query" }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Voyage embeddings request failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.data[0].embedding;
}

function getToolInput(message: Anthropic.Message, toolName: string): Record<string, unknown> {
  const block = message.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === toolName
  );
  if (!block || typeof block.input !== "object" || block.input === null) {
    throw new Error(`Claude did not return a valid "${toolName}" tool call.`);
  }
  return block.input as Record<string, unknown>;
}

async function generateFollowUpQuestion(
  anthropic: Anthropic,
  description: string,
  candidates: MatchRow[]
): Promise<string> {
  const candidateSummaries = candidates
    .map((c, i) => `${i + 1}. Category: ${c.category}. What it's about: ${c.definition}`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 300,
    system:
      "You help figure out which of a short list of British-culture-norm candidates a user's description is actually about. You never explain, name, or reveal the candidates to the user. You only ask exactly one short, natural, friendly clarifying question that would help tell the candidates apart.",
    messages: [
      {
        role: "user",
        content: `A user described a confusing moment:\n"${description}"\n\nCandidate norms this could be about:\n${candidateSummaries}\n\nAsk one short clarifying question that would help determine which of these (if any) actually applies.`,
      },
    ],
    tools: [FOLLOW_UP_TOOL],
    tool_choice: { type: "tool", name: FOLLOW_UP_TOOL.name },
  });

  const input = getToolInput(message, FOLLOW_UP_TOOL.name);
  const question = typeof input.question === "string" ? input.question.trim() : "";
  if (!question) throw new Error("Claude returned an empty follow-up question.");
  return question;
}

async function generateGroundedAnswer(
  anthropic: Anthropic,
  description: string,
  followUp: FollowUp | undefined,
  entry: MatchRow
): Promise<GroundedOutcome> {
  const followUpBlock = followUp ? `\n\nFollow-up Q: ${followUp.question}\nA: ${followUp.answer}` : "";

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 600,
    system:
      "You produce structured output for Bridgely's Debrief tool, which explains British cultural communication norms to newcomers. Ground every claim about British culture strictly in the single taxonomy entry provided below — never introduce a claim about British culture, etiquette, or norms that isn't present in that entry. You may reference specifics the user themselves mentioned (e.g. who said what) when phrasing surface_signal and suggested_response, but the underlying explanation must come only from the provided entry.",
    messages: [
      {
        role: "user",
        content: `User's description of a confusing moment:\n"${description}"${followUpBlock}\n\nMatched taxonomy entry (norm_id: ${entry.norm_id}):\nCategory: ${entry.category}\nDefinition: ${entry.definition}\nSurface markers: ${entry.surface_markers}\nWhat it actually means: ${entry.what_it_means}\nExample: ${entry.example}\nGood response: ${entry.good_response}\n\nUsing ONLY the entry above, produce the structured result.`,
      },
    ],
    tools: [DEBRIEF_TOOL],
    tool_choice: { type: "tool", name: DEBRIEF_TOOL.name },
  });

  const input = getToolInput(message, DEBRIEF_TOOL.name);
  const { entry_applies, likely_norm, surface_signal, what_it_means, suggested_response } =
    input as Partial<DebriefResult> & { entry_applies?: unknown };

  // TEMP DEBUG: remove after threshold calibration.
  console.log("[debrief-debug] entry_applies:", entry_applies, "for", entry.norm_id);

  // Primary decline signal. The other fields are placeholders when this is false.
  if (typeof entry_applies !== "boolean") {
    throw new Error("Claude returned a debrief result without a boolean entry_applies.");
  }
  if (!entry_applies) return { applies: false };

  // Secondary safety net: catches a genuinely malformed response.
  if (!likely_norm || !surface_signal || !what_it_means || !suggested_response) {
    throw new Error("Claude returned an incomplete structured debrief result.");
  }
  return { applies: true, result: { likely_norm, surface_signal, what_it_means, suggested_response } };
}

async function logGap(
  supabase: ReturnType<typeof getClients>["supabase"],
  args: {
    description: string;
    followUp: FollowUp | undefined;
    top: MatchRow | undefined;
    topSimilarity: number;
    declineReason: DeclineReason;
  }
) {
  try {
    const { error } = await supabase.from("debrief_gaps").insert({
      description: args.description,
      follow_up_question: args.followUp?.question ?? null,
      follow_up_answer: args.followUp?.answer ?? null,
      best_candidate_norm_id: args.top?.norm_id ?? null,
      best_candidate_similarity: args.topSimilarity,
      decline_reason: args.declineReason,
    });
    if (error) throw error;
  } catch (err) {
    // Don't fail the user-facing response just because logging the gap failed.
    console.error("Failed to log debrief gap:", err);
  }
}

export async function POST(request: NextRequest) {
  // Checked first, before any body parsing or Voyage/Claude/Supabase call.
  if (!checkRateLimit(getClientKey(request), Date.now())) {
    return NextResponse.json(
      { status: "error", message: "Too many requests, please wait a moment and try again" },
      { status: 429, headers: { "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1000) } }
    );
  }

  let body: { description?: string; followUp?: FollowUp };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid request body." }, { status: 400 });
  }

  const description = body.description?.trim();
  if (!description) {
    return NextResponse.json({ status: "error", message: "A description is required." }, { status: 400 });
  }
  const followUp = body.followUp;

  let clients: ReturnType<typeof getClients>;
  try {
    clients = getClients();
  } catch (err) {
    console.error("Debrief route is misconfigured:", err);
    return NextResponse.json(
      { status: "error", message: "The debrief service isn't set up correctly yet." },
      { status: 500 }
    );
  }
  const { supabase, anthropic } = clients;

  const textToEmbed = followUp
    ? `${description}\n\nFollow-up Q: ${followUp.question}\nA: ${followUp.answer}`
    : description;

  let queryEmbedding: number[];
  try {
    queryEmbedding = await embedQuery(textToEmbed);
  } catch (err) {
    console.error("Voyage embedding request failed:", err);
    return NextResponse.json(
      { status: "error", message: "Couldn't process that description right now. Please try again." },
      { status: 502 }
    );
  }

  let matches: MatchRow[];
  try {
    const { data, error } = await supabase.rpc("match_taxonomy_entries", {
      query_embedding: queryEmbedding,
      match_count: 3,
    });
    if (error) throw error;
    matches = (data ?? []) as MatchRow[];
  } catch (err) {
    console.error("Supabase match_taxonomy_entries call failed:", err);
    return NextResponse.json(
      { status: "error", message: "Couldn't look that up right now. Please try again." },
      { status: 502 }
    );
  }

  // TEMP DEBUG: remove after threshold calibration.
  console.log(
    "[debrief-debug] match_taxonomy_entries:",
    JSON.stringify(
      matches.map((m) => ({ norm_id: m.norm_id, category: m.category, similarity: m.similarity })),
      null,
      2
    )
  );

  const top = matches[0] as MatchRow | undefined;
  const topSimilarity = top?.similarity ?? 0;

  // Only ask a disambiguating follow-up if there's actually something to
  // disambiguate between, this is the first pass, and confidence is low.
  const shouldAskFollowUp = !followUp && matches.length > 0 && topSimilarity < CONFIDENT_THRESHOLD;

  if (shouldAskFollowUp) {
    try {
      const question = await generateFollowUpQuestion(anthropic, description, matches.slice(0, 3));
      return NextResponse.json({ status: "needs_follow_up", question });
    } catch (err) {
      console.error("Claude follow-up generation failed:", err);
      return NextResponse.json(
        { status: "error", message: "Couldn't come up with a follow-up question right now. Please try again." },
        { status: 502 }
      );
    }
  }

  // Committing to an answer: either a follow-up was already supplied (second
  // call), or confidence was already high enough on the first pass.
  if (!top || topSimilarity < FLOOR_THRESHOLD) {
    await logGap(supabase, { description, followUp, top, topSimilarity, declineReason: "below_floor_threshold" });
    return NextResponse.json({ status: "no_match", message: NO_MATCH_MESSAGE });
  }

  try {
    const outcome = await generateGroundedAnswer(anthropic, description, followUp, top);
    if (!outcome.applies) {
      await logGap(supabase, { description, followUp, top, topSimilarity, declineReason: "entry_did_not_apply" });
      return NextResponse.json({ status: "no_match", message: NO_MATCH_MESSAGE });
    }
    return NextResponse.json({ status: "matched", result: outcome.result });
  } catch (err) {
    console.error("Claude grounded generation failed:", err);
    return NextResponse.json(
      { status: "error", message: "Couldn't put together an answer right now. Please try again." },
      { status: 502 }
    );
  }
}
