// Mock data standing in for `taxonomy_entries`, `scenarios`, and `debriefs`.
// Shape matches the Supabase data model in CLAUDE.md so swapping in real
// queries later is a drop-in replacement, not a rewrite.

import { generatedTaxonomy } from "./taxonomy-generated";

export type NormEntry = {
  normId: string;
  category: "Workplace" | "Healthcare" | "Housing & landlord" | "Job search" | "Social" | "Admin & bureaucracy";
  definition: string;
  surfaceMarkers: string;
  whatItMeans: string;
  example: string;
  goodResponse: string;
  status: "Draft" | "Approved";
};

// Real taxonomy content, generated from data/bridgely_taxonomy_template.xlsx.
// Edit the spreadsheet and re-run `npm run taxonomy:import`, don't edit here.
export const taxonomy: NormEntry[] = generatedTaxonomy;

export type ScenarioStep = {
  prompt: string;
  options: { text: string; correct: boolean; feedback: string }[];
};

export type Scenario = {
  id: string;
  title: string;
  normId: string;
  category: NormEntry["category"];
  setup: string;
  steps: ScenarioStep[];
  provisional?: boolean;
};

export const scenarios: Scenario[] = [
  {
    id: "scn-manager-friday",
    title: "Asking your manager for a schedule change",
    normId: "WP-1-indirect-refusal-workplace",
    category: "Workplace",
    setup:
      "You've asked your manager if you can leave early on Fridays for a class. He replies:",
    steps: [
      {
        prompt: "\u201cIt's not ideal, but let's see how it goes.\u201d \u2014 What do you say next?",
        options: [
          {
            text: "\u201cGreat, thank you!\u201d \u2014 and leave early this Friday",
            correct: false,
            feedback:
              "This wasn't a yes. In British workplace speech, 'let's see how it goes' is a hedge, not approval \u2014 treating it as a green light is the exact mismatch this norm describes.",
          },
          {
            text: "\u201cJust so I plan properly \u2014 is that a yes for this Friday, or should I check back in a few weeks?\u201d",
            correct: true,
            feedback:
              "This gets you a real answer without sounding pushy \u2014 it turns a vague hedge into a concrete commitment.",
          },
          {
            text: "\u201cOkay.\u201d \u2014 and drop the subject entirely",
            correct: false,
            feedback:
              "Understandable instinct, but this leaves you with no answer at all \u2014 you'll be back to guessing next Friday.",
          },
        ],
      },
    ],
  },
  {
    id: "scn-landlord-heating",
    title: "Chasing your landlord about a repair",
    normId: "HL-1-landlord-vague-commitment",
    category: "Housing & landlord",
    setup: "You've asked your landlord to fix the heating. They reply:",
    steps: [
      {
        prompt: "\u201cI'll see what I can do about it.\u201d \u2014 What do you say next?",
        options: [
          {
            text: "\u201cThanks, appreciate it!\u201d \u2014 and wait to hear back",
            correct: false,
            feedback:
              "This is a non-committal response, not a plan \u2014 without a follow-up, 'I'll see what I can do' often means the request quietly sits at the bottom of the list.",
          },
          {
            text: "\u201cCould you give me a rough date for the repair? It's been two weeks.\u201d",
            correct: true,
            feedback:
              "This turns a vague deferral into a concrete ask \u2014 requesting a specific date is what usually gets a repair actually scheduled.",
          },
          {
            text: "\u201cOkay, I'll just wait then.\u201d \u2014 and drop the subject entirely",
            correct: false,
            feedback:
              "Understandable instinct, but passive waiting is exactly how vague landlord replies turn into months of no action.",
          },
        ],
      },
    ],
  },
  {
    id: "scn-gp-appointment",
    title: "A short GP appointment",
    normId: "HC-1-gp-appointment-brevity",
    category: "Healthcare",
    setup:
      "Your GP appointment is 8 minutes long, and it's wrapping up with a follow-up question you haven't asked yet.",
    steps: [
      {
        prompt: "The appointment is about to end. What's the right move?",
        options: [
          {
            text: "Stay silent and assume it's over",
            correct: false,
            feedback:
              "The brevity is about the time slot, not a signal that your concern is minor — staying quiet just means the follow-up question goes unasked.",
          },
          {
            text: "“Could we book a longer appointment to go through this properly?”",
            correct: true,
            feedback:
              "This works with the system's time-slot structure instead of against it — asking directly for more time is the expected way to get a fuller conversation.",
          },
          {
            text: "Apologize for taking up time and leave",
            correct: false,
            feedback:
              "No apology is needed — the short slot is standard practice, not a sign that you're imposing on the GP.",
          },
        ],
      },
    ],
  },
  {
    id: "scn-interview-silence",
    title: "Waiting after a final-round interview",
    normId: "JS-1-vague-interview-feedback",
    category: "Job search",
    setup:
      "You were told “we'll let you know either way” after a final-round interview. It's been three weeks of silence.",
    steps: [
      {
        prompt: "What do you do?",
        options: [
          {
            text: "Keep waiting indefinitely",
            correct: false,
            feedback:
              "Silence past the stated timeline usually is the answer — waiting indefinitely just delays accepting that and moving on.",
          },
          {
            text: "Send one polite follow-up, then treat continued silence as a likely no and move on",
            correct: true,
            feedback:
              "This is the right balance — not pushy, not passive, and it gets you a clear signal either way.",
          },
          {
            text: "Call the office repeatedly to demand an explanation",
            correct: false,
            feedback:
              "This reads as pressure, not diligence — it's unlikely to speed up an answer and may leave a worse impression.",
          },
        ],
      },
    ],
  },
  {
    id: "scn-decline-invite",
    title: "A colleague declines your invite",
    normId: "SO-2-declining-invitation-vague-excuse",
    category: "Social",
    provisional: true,
    setup:
      "You invited a colleague to a work social. They said, “I've got a bit of a thing that day, sorry!” and offered no more detail.",
    steps: [
      {
        prompt: "What do you say?",
        options: [
          {
            text: "“What thing? Is everything okay?” — press for the real reason",
            correct: false,
            feedback:
              "Vague declines are socially complete on their own — pressing for more detail tends to make people uncomfortable rather than getting you a real answer.",
          },
          {
            text: "“No worries, another time!”",
            correct: true,
            feedback:
              "This accepts the vague decline at face value — exactly what's expected, and it keeps things easy for both of you.",
          },
          {
            text: "Quietly write them off as uninterested going forward",
            correct: false,
            feedback:
              "One vague decline isn't a signal of disinterest — it's a normal, polite way to say no without giving a specific reason.",
          },
        ],
      },
    ],
  },
  {
    id: "scn-bank-letter",
    title: "A formal-sounding letter from your bank",
    normId: "AB-2-bank-letter-formal-tone-routine",
    category: "Admin & bureaucracy",
    provisional: true,
    setup:
      "A letter arrives from your bank in serious, legal-sounding language, asking you to confirm your address with updated proof documents.",
    steps: [
      {
        prompt: "What's the right response?",
        options: [
          {
            text: "Panic and assume there's a problem with the account",
            correct: false,
            feedback:
              "This is standard template language for a routine compliance check — the tone doesn't indicate any actual suspicion about your account.",
          },
          {
            text: "Respond to the specific document request within the deadline, calling the number on an official statement if unsure",
            correct: true,
            feedback:
              "This treats the content, not the tone, as the real signal — exactly the right way to handle a routine but time-bound request.",
          },
          {
            text: "Ignore it as generic bank confusion",
            correct: false,
            feedback:
              "It's a real, time-bound request even though the tone is alarmist — ignoring it risks missing the actual deadline.",
          },
        ],
      },
    ],
  },
];

// Onboarding: situation-to-category weighting, used to pick a starting point
// in the taxonomy before any practice or debrief data exists for a user.

export type CategoryCode = "WP" | "HC" | "HL" | "JS" | "SO" | "AB";

export const CATEGORY_LABELS: Record<CategoryCode, NormEntry["category"]> = {
  WP: "Workplace",
  HC: "Healthcare",
  HL: "Housing & landlord",
  JS: "Job search",
  SO: "Social",
  AB: "Admin & bureaucracy",
};

// Reverse of CATEGORY_LABELS, for turning a category label (e.g. the
// topCategory returned by /api/classify-struggle) back into a CategoryCode.
const CATEGORY_CODE_BY_LABEL = Object.fromEntries(
  (Object.entries(CATEGORY_LABELS) as [CategoryCode, string][]).map(([code, label]) => [label, code])
) as Record<string, CategoryCode>;

export const CATEGORY_BLURBS: Record<string, string> = {
  Workplace: "Meetings, managers, colleagues",
  "Housing & landlord": "Repairs, notices, flatmates",
  Healthcare: "GPs, appointments, NHS process",
  "Job search": "Interviews, applications, offers",
  Social: "Invitations, small talk, everyday norms",
  "Admin & bureaucracy": "Councils, banks, official letters",
};

export function getScenariosByCategory(category: string): Scenario[] {
  return scenarios.filter((s) => s.category === category);
}

export function getCategoryScenarioCounts(): { category: string; count: number }[] {
  return (Object.keys(CATEGORY_LABELS) as CategoryCode[]).map((code) => {
    const category = CATEGORY_LABELS[code];
    return { category, count: getScenariosByCategory(category).length };
  });
}

export type Situation = {
  label: string;
  description: string;
  category: CategoryCode;
};

export const SITUATIONS: Situation[] = [
  { label: "Work", description: "Colleagues, managers", category: "WP" },
  { label: "Healthcare", description: "GP, NHS, pharmacy", category: "HC" },
  { label: "Housing", description: "Landlord, flatmates, neighbours", category: "HL" },
  { label: "Job search", description: "Interviews, applications", category: "JS" },
  { label: "Social life", description: "Friends, small talk, invitations", category: "SO" },
  { label: "Admin & bureaucracy", description: "Banks, councils", category: "AB" },
];

// Life-stage / role chips shown in onboarding, and the category bonus each adds.
// Additive only: like the time-in-UK modifier, a role never subtracts weight from
// or overrides what the user explicitly picked in situations.
export const ROLES = ["Employed", "Job-seeking", "Student", "Stay-at-home parent", "Retired", "Other"];

const ROLE_MODIFIERS: Record<string, Partial<Record<CategoryCode, number>>> = {
  Employed: { WP: 2 },
  "Job-seeking": { JS: 2 },
  Student: { AB: 2, SO: 1 },
  "Stay-at-home parent": { AB: 2, SO: 1 },
  Retired: { HC: 2, SO: 1 },
  Other: {},
};

function naturalJoin(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function computeStartingPoint(
  situations: string[],
  timeInUk: string,
  role: string,
  struggleCategory?: string | null
): { rankedCategories: string[]; summary: string } {
  const selected = SITUATIONS.filter((s) => situations.includes(s.label));

  const scores: Record<CategoryCode, number> = { WP: 0, HC: 0, HL: 0, JS: 0, SO: 0, AB: 0 };
  for (const s of selected) {
    scores[s.category] += 2;
  }

  if (timeInUk === "Just arrived" || timeInUk === "Under 1 year") {
    scores.HL += 1;
    scores.AB += 1;
  } else if (timeInUk === "3+ years") {
    scores.WP += 1;
    scores.SO += 1;
  }

  // Stacks with the time-in-UK modifier above.
  const roleBoosted = new Set<CategoryCode>();
  for (const [code, bonus] of Object.entries(ROLE_MODIFIERS[role] ?? {})) {
    scores[code as CategoryCode] += bonus;
    if (bonus > 0) roleBoosted.add(code as CategoryCode);
  }

  // Struggle-text classification (from /api/classify-struggle), same +2 tier
  // as a role's primary bonus — added to roleBoosted so it shares that tier's
  // tiebreak below rather than needing its own. Additive only, like every
  // other modifier here: it can win a tie against an unselected category, but
  // the explicitlySelected tier still outranks it, so it never lets an
  // unselected category beat one the user actually picked in situations.
  const struggleCode = struggleCategory ? CATEGORY_CODE_BY_LABEL[struggleCategory] : undefined;
  if (struggleCode) {
    scores[struggleCode] += 2;
    roleBoosted.add(struggleCode);
  }

  const explicitlySelected = new Set(selected.map((s) => s.category));
  const flag = (set: Set<CategoryCode>, code: CategoryCode) => (set.has(code) ? 1 : 0);

  // Ties on score resolve in three tiers: (1) an explicitly selected situation
  // beats an unselected one, (2) a role- or struggle-boosted category beats an
  // un-boosted one, (3) otherwise the key order of `scores` (WP, HC, HL, JS,
  // SO, AB), which the stable sort preserves.
  const rankedCategories = (Object.keys(scores) as CategoryCode[])
    .filter((code) => scores[code] > 0)
    .sort(
      (a, b) =>
        scores[b] - scores[a] ||
        flag(explicitlySelected, b) - flag(explicitlySelected, a) ||
        flag(roleBoosted, b) - flag(roleBoosted, a)
    )
    .slice(0, 3)
    .map((code) => CATEGORY_LABELS[code]);

  const situationPhrase = naturalJoin(selected.map((s) => s.label.toLowerCase()));
  const categoryPhrase = naturalJoin(rankedCategories);

  let summary: string;
  if (timeInUk === "Just arrived") {
    summary = `Since you've just landed and are already juggling ${situationPhrase}, we'll start with the norms that matter most in the first few weeks: ${categoryPhrase}.`;
  } else if (timeInUk === "Under 1 year") {
    summary = `Because you're still settling in and sorting out ${situationPhrase}, we'll start you with ${categoryPhrase} \u2014 the norms that trip people up early.`;
  } else if (timeInUk === "3+ years") {
    summary = `You've been here a while now, so it's less about survival and more about the subtler stuff people still miss \u2014 given how much of your time goes to ${situationPhrase}, we'll start with ${categoryPhrase}.`;
  } else {
    summary = `Because you're a couple of years in and dealing with ${situationPhrase}, we'll start you with ${categoryPhrase}.`;
  }

  return { rankedCategories, summary };
}

