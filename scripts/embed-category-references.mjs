// Embeds the six fixed taxonomy-category reference texts via Voyage and
// writes lib/category-reference-embeddings.json, which app/api/classify-struggle
// compares onboarding "struggle" text against via cosine similarity.
//
// One-time/rarely-rerun: only needs re-running if the reference texts below
// change. Run via `npm run embed-category-refs`. The output file contains no
// secrets, just embedding vectors, so it's committed to the repo.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "lib", "category-reference-embeddings.json");

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env.local"));
} catch {
  // .env.local is optional here — env vars may already be set in the shell/CI.
}

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const VOYAGE_MODEL = "voyage-3";

// Category names match NormEntry["category"] / CATEGORY_LABELS values in
// lib/mock-data.ts verbatim — app/api/classify-struggle returns one of these
// as topCategory, and computeStartingPoint() maps it back to a CategoryCode.
const CATEGORY_REFERENCES = [
  {
    category: "Workplace",
    text: "Confused about mixed signals from a manager or colleague, indirect feedback in meetings, not knowing if a vague answer meant yes or no, workplace hierarchy and unwritten office norms.",
  },
  {
    category: "Healthcare",
    text: "Confused about how the NHS or GP appointments work, whether a doctor's brief answer means something is being taken seriously, pharmacist referrals, healthcare admin and triage language.",
  },
  {
    category: "Housing & landlord",
    text: "Confused about a landlord's vague promises about repairs, tenancy agreements, deposit protection, dealing with flatmates or housemates, notices and rental admin.",
  },
  {
    category: "Job search",
    text: "Confused about vague interview feedback, recruiter communication, CV tone, notice periods, networking norms, whether silence after an interview means rejection.",
  },
  {
    category: "Social",
    text: "Confused about British small talk, understatement, self-deprecating humour, queueing etiquette, declining invitations politely, making friends and reading social cues.",
  },
  {
    category: "Admin & bureaucracy",
    text: "Confused about council tax, bank letters, HMRC correspondence, official forms, proof-of-address requirements, formal-sounding letters that turn out to be routine.",
  },
];

const MAX_EMBED_RETRIES = 5;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embed(text, attempt = 1) {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: [text], model: VOYAGE_MODEL, input_type: "document" }),
  });

  if (res.status === 429 && attempt <= MAX_EMBED_RETRIES) {
    const retryAfterHeader = res.headers.get("retry-after");
    const delayMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : Math.min(20000 * attempt, 60000);
    console.log(
      `Rate limited by Voyage, retrying in ${Math.round(delayMs / 1000)}s (attempt ${attempt}/${MAX_EMBED_RETRIES})...`
    );
    await sleep(delayMs);
    return embed(text, attempt + 1);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Voyage embeddings request failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.data[0].embedding;
}

async function main() {
  if (!VOYAGE_API_KEY) {
    console.error("Missing required env var: VOYAGE_API_KEY");
    console.error("Set it in .env.local (or the environment) before running this script.");
    process.exit(1);
  }

  const results = [];
  for (const { category, text } of CATEGORY_REFERENCES) {
    console.log(`Embedding reference text for "${category}"...`);
    const embedding = await embed(text);
    results.push({ category, embedding });
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2) + "\n");
  console.log(`Wrote ${results.length} category reference embeddings to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch((err) => {
  console.error("Embedding category references failed:", err.message);
  process.exit(1);
});
