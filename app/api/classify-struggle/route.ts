import { NextRequest, NextResponse } from "next/server";
import categoryReferenceEmbeddings from "@/lib/category-reference-embeddings.json";

// Classifies onboarding's free-text "struggle" answer against the six fixed
// taxonomy categories via Voyage embeddings + cosine similarity, so it can
// feed an extra signal into computeStartingPoint() alongside the situations/
// timeInUk/role modifiers already collected on the same step.
//
// Calibration data only right now (see the [struggle-classify] log below) —
// no confidence floor applied yet, mirroring how app/api/debrief/route.ts's
// CONFIDENT_THRESHOLD/FLOOR_THRESHOLD were only added after a first batch of
// real similarity numbers, not guessed upfront.

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const VOYAGE_MODEL = "voyage-3";

type CategoryReference = { category: string; embedding: number[] };

const REFERENCES = categoryReferenceEmbeddings as CategoryReference[];

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

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(request: NextRequest) {
  try {
    if (!VOYAGE_API_KEY) {
      throw new Error("Missing required env var: VOYAGE_API_KEY");
    }

    let body: { struggle?: string };
    try {
      body = await request.json();
    } catch {
      throw new Error("Invalid request body.");
    }

    const struggle = body.struggle?.trim();
    if (!struggle) {
      throw new Error("A struggle description is required.");
    }

    const queryEmbedding = await embedQuery(struggle);

    const ranked = REFERENCES.map((ref) => ({
      category: ref.category,
      similarity: cosineSimilarity(queryEmbedding, ref.embedding),
    })).sort((a, b) => b.similarity - a.similarity);

    // Calibration data — log everything, not just the winner, same as
    // debrief's [debrief-debug] logging was used before its thresholds
    // were set from real numbers.
    console.log("[struggle-classify]", JSON.stringify(ranked, null, 2));

    const top = ranked[0];
    if (!top) {
      return NextResponse.json({ topCategory: null });
    }

    return NextResponse.json({ topCategory: top.category, similarity: top.similarity });
  } catch (err) {
    // This classification should never block onboarding submission — fail
    // gracefully with a null result instead of a 500.
    console.error("[struggle-classify] failed:", err);
    return NextResponse.json({ topCategory: null });
  }
}
