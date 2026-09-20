// Reads the "Taxonomy" sheet from data/bridgely_taxonomy_template.xlsx and
// generates lib/taxonomy-generated.ts. Run via `npm run taxonomy:import`.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseTaxonomy, VALID_CATEGORIES } from "./lib/parse-taxonomy.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.join(__dirname, "..", "data", "bridgely_taxonomy_template.xlsx");
const OUTPUT_PATH = path.join(__dirname, "..", "lib", "taxonomy-generated.ts");

function main() {
  const { entries, errors } = parseTaxonomy(SOURCE_PATH);

  if (errors.length > 0) {
    console.error(`Taxonomy import failed with ${errors.length} problem(s):\n`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  const header = `// AUTO-GENERATED from data/bridgely_taxonomy_template.xlsx by scripts/import-taxonomy.mjs
// Do not edit by hand — edit the spreadsheet and re-run: npm run taxonomy:import
import type { NormEntry } from "./mock-data";

export const generatedTaxonomy: NormEntry[] = ${JSON.stringify(entries, null, 2)};
`;

  writeFileSync(OUTPUT_PATH, header);

  const perCategory = {};
  let approvedCount = 0;
  let draftCount = 0;
  for (const entry of entries) {
    perCategory[entry.category] = (perCategory[entry.category] ?? 0) + 1;
    if (entry.status === "Approved") approvedCount += 1;
    else draftCount += 1;
  }
  const categorySummary = VALID_CATEGORIES.map((c) => `${c}: ${perCategory[c] ?? 0}`).join(", ");

  console.log(
    `Imported ${entries.length} entries (${approvedCount} Approved, ${draftCount} Draft) — ${categorySummary}`
  );
}

main();
