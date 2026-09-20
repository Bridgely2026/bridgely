// Shared parse+validate logic for the "Taxonomy" sheet in
// data/bridgely_taxonomy_template.xlsx. Used by both
// scripts/import-taxonomy.mjs (generates lib/taxonomy-generated.ts) and
// scripts/sync-taxonomy-db.mjs (embeds and upserts into Supabase).

import XLSX from "xlsx";

export const SHEET_NAME = "Taxonomy";

export const VALID_CATEGORIES = [
  "Workplace",
  "Healthcare",
  "Housing & landlord",
  "Job search",
  "Social",
  "Admin & bureaucracy",
];

export const VALID_STATUSES = ["Draft", "Approved"];

const COLUMNS = {
  category: "Category",
  normId: "Norm ID",
  definition: "Definition",
  surfaceMarkers: "Surface Markers",
  whatItMeans: "What It Actually Means",
  example: "Example (anonymized)",
  goodResponse: "Good Response",
  status: "Status",
};

function isBlank(value) {
  return value === null || value === undefined || String(value).trim() === "";
}

function clean(value) {
  return String(value).trim();
}

// Parses and validates the Taxonomy sheet at `sourcePath`. Returns
// { entries, errors }. Unfilled template rows (no Category and no Norm ID)
// are skipped quietly. Any other row-level problem is collected as a
// human-readable string in `errors` rather than thrown, so callers can print
// every problem at once before deciding whether to fail loudly.
export function parseTaxonomy(sourcePath) {
  const workbook = XLSX.readFile(sourcePath);
  const sheet = workbook.Sheets[SHEET_NAME];
  if (!sheet) {
    return { entries: [], errors: [`Sheet "${SHEET_NAME}" not found in ${sourcePath}`] };
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const errors = [];
  const entries = [];
  const seenNormIds = new Map();

  rows.forEach((row, i) => {
    const rowNumber = i + 2; // account for the header row
    const category = row[COLUMNS.category];
    const normId = row[COLUMNS.normId];

    // Unfilled template rows: no category and no norm id. Skip quietly.
    if (isBlank(category) && isBlank(normId)) {
      return;
    }

    const rowErrors = [];

    if (isBlank(category)) {
      rowErrors.push("missing Category");
    } else if (!VALID_CATEGORIES.includes(clean(category))) {
      rowErrors.push(
        `invalid Category "${clean(category)}" (must be one of: ${VALID_CATEGORIES.join(", ")})`
      );
    }

    if (isBlank(normId)) {
      rowErrors.push("missing Norm ID");
    }

    for (const field of ["definition", "surfaceMarkers", "whatItMeans", "example", "goodResponse"]) {
      if (isBlank(row[COLUMNS[field]])) {
        rowErrors.push(`missing ${COLUMNS[field]}`);
      }
    }

    const status = row[COLUMNS.status];
    if (isBlank(status)) {
      rowErrors.push("missing Status");
    } else if (!VALID_STATUSES.includes(clean(status))) {
      rowErrors.push(`invalid Status "${clean(status)}" (must be exactly "Draft" or "Approved")`);
    }

    if (!isBlank(normId)) {
      const id = clean(normId);
      if (seenNormIds.has(id)) {
        rowErrors.push(`duplicate Norm ID "${id}" (first seen at row ${seenNormIds.get(id)})`);
      } else {
        seenNormIds.set(id, rowNumber);
      }
    }

    if (rowErrors.length > 0) {
      for (const err of rowErrors) {
        errors.push(`Row ${rowNumber}: ${err}`);
      }
      return;
    }

    entries.push({
      normId: clean(normId),
      category: clean(category),
      definition: clean(row[COLUMNS.definition]),
      surfaceMarkers: clean(row[COLUMNS.surfaceMarkers]),
      whatItMeans: clean(row[COLUMNS.whatItMeans]),
      example: clean(row[COLUMNS.example]),
      goodResponse: clean(row[COLUMNS.goodResponse]),
      status: clean(status),
    });
  });

  return { entries, errors };
}
