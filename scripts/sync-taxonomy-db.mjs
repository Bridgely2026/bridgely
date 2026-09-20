// Embeds and upserts Approved taxonomy entries into Supabase (taxonomy_entries),
// backing the real RAG pipeline behind Debrief. Run via `npm run taxonomy:sync-db`.
//
// Assumes a `taxonomy_entries` table shaped roughly like:
//   norm_id (text, primary key / unique), category, definition, surface_markers,
//   what_it_means, example, good_response, status, content_hash, embedding (vector),
//   active (boolean), updated_at (timestamptz)
// per bridgely_rag_schema.sql (applied separately, not part of this repo).

import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { parseTaxonomy } from "./lib/parse-taxonomy.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.join(__dirname, "..", "data", "bridgely_taxonomy_template.xlsx");

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env.local"));
} catch {
  // .env.local is optional here — env vars may already be set in the shell/CI.
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const VOYAGE_MODEL = "voyage-3";

function requireEnv() {
  const missing = [];
  if (!SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!VOYAGE_API_KEY) missing.push("VOYAGE_API_KEY");
  if (missing.length > 0) {
    console.error(`Missing required env var(s): ${missing.join(", ")}`);
    console.error("Set them in .env.local (or the environment) before running this script.");
    process.exit(1);
  }
}

function contentHash(entry) {
  const raw = [
    entry.category,
    entry.definition,
    entry.surfaceMarkers,
    entry.whatItMeans,
    entry.example,
    entry.goodResponse,
  ].join("");
  return createHash("sha256").update(raw).digest("hex");
}

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
  requireEnv();

  const { entries, errors } = parseTaxonomy(SOURCE_PATH);
  if (errors.length > 0) {
    console.error(`Taxonomy sync failed with ${errors.length} problem(s):\n`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  const approved = entries.filter((e) => e.status === "Approved");
  const approvedNormIds = approved.map((e) => e.normId);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let existingHashByNormId = new Map();
  if (approvedNormIds.length > 0) {
    const { data: existingRows, error: fetchError } = await supabase
      .from("taxonomy_entries")
      .select("norm_id, content_hash")
      .in("norm_id", approvedNormIds);

    if (fetchError) {
      console.error("Failed to read existing taxonomy_entries:", fetchError.message);
      process.exit(1);
    }
    existingHashByNormId = new Map((existingRows ?? []).map((r) => [r.norm_id, r.content_hash]));
  }

  let embeddedCount = 0;
  let skippedCount = 0;

  for (const entry of approved) {
    const hash = contentHash(entry);
    const existingHash = existingHashByNormId.get(entry.normId);
    const needsEmbedding = existingHash !== hash;

    let embedding = null;
    if (needsEmbedding) {
      const text = [
        entry.category,
        entry.definition,
        entry.surfaceMarkers,
        entry.whatItMeans,
        entry.example,
        entry.goodResponse,
      ].join("\n\n");
      try {
        embedding = await embed(text);
      } catch (err) {
        console.error(`Failed to embed ${entry.normId}:`, err.message);
        process.exit(1);
      }
      embeddedCount += 1;
    } else {
      skippedCount += 1;
    }

    const row = {
      norm_id: entry.normId,
      category: entry.category,
      definition: entry.definition,
      surface_markers: entry.surfaceMarkers,
      what_it_means: entry.whatItMeans,
      example: entry.example,
      good_response: entry.goodResponse,
      status: entry.status,
      content_hash: hash,
      active: true,
      updated_at: new Date().toISOString(),
    };
    if (embedding) row.embedding = embedding;

    const { error: upsertError } = await supabase
      .from("taxonomy_entries")
      .upsert(row, { onConflict: "norm_id" });

    if (upsertError) {
      console.error(`Failed to upsert ${entry.normId}:`, upsertError.message);
      process.exit(1);
    }
  }

  // Reconciliation: deactivate anything no longer in this run's Approved set
  // (un-approved or removed from the sheet). Never hard-delete — debrief_gaps
  // may reference the norm_id.
  let deactivateQuery = supabase
    .from("taxonomy_entries")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("active", true);

  if (approvedNormIds.length > 0) {
    deactivateQuery = deactivateQuery.not("norm_id", "in", `(${approvedNormIds.join(",")})`);
  }

  const { data: deactivated, error: deactivateError } = await deactivateQuery.select("norm_id");
  if (deactivateError) {
    console.error("Failed to deactivate stale taxonomy_entries:", deactivateError.message);
    process.exit(1);
  }
  const deactivatedCount = deactivated?.length ?? 0;

  console.log(
    `Taxonomy sync complete: ${approved.length} Approved rows processed — ${embeddedCount} newly embedded, ${skippedCount} unchanged (skipped), ${deactivatedCount} deactivated.`
  );
}

main().catch((err) => {
  console.error("Taxonomy sync failed:", err.message);
  process.exit(1);
});
