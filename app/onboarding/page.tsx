"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { ROLES, SITUATIONS, computeStartingPoint } from "@/lib/mock-data";
import { ensureAnonymousUserId, getSupabaseBrowser } from "@/lib/supabase-browser";

const TIME_IN_UK = ["Just arrived", "Under 1 year", "1–3 years", "3+ years"];
const HOUSEHOLD = ["Living alone", "With a partner", "With family or kids", "With flatmates or housemates"];
const SECTORS = ["Tech", "Healthcare", "Hospitality", "Education", "Trades", "Other"];
// Goal is stored on the users row but not scored into computeStartingPoint()
// — an unchanged decision from earlier, still true with this longer list.
// Category comments are for internal reference only, never rendered.
const GOALS = [
  "Feel more confident in day-to-day conversations", // Broad/Everyday
  "Excel in professional & workplace settings", // Career Focus
  "Blend in socially and master British humor", // Social Integration
  "Prepare for an upcoming event or relocation", // Time-Sensitive
  "Learn indirect language, etiquette, and polite phrasing", // Nuance Focus
  "Understand why British indirectness isn't evasion or dishonesty", // Directness Recalibration
  "Understand something specific that confused me", // Problem-Solving
];

// Sector is only collected when one of these situations was picked in step 1.
const SECTOR_SITUATIONS = ["Work", "Job search"];

const TOTAL_STEPS = 3;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Floor on /api/classify-struggle's similarity score below which the result
// is treated as no classification at all (same as a failed/null response) —
// too low to trust as a signal into computeStartingPoint(). [struggle-classify]
// still logs every score unconditionally server-side regardless of this floor,
// so real usage data keeps accumulating for a future recalibration pass.
const STRUGGLE_CATEGORY_FLOOR = 0.3;

function Chip({
  selected,
  onClick,
  title,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={selected}
      className={`border px-4 py-2 text-sm transition ${
        selected ? "border-ink bg-ink text-paper" : "border-line bg-white/50 text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [situations, setSituations] = useState<string[]>([]);
  const [household, setHousehold] = useState("");
  const [timeInUk, setTimeInUk] = useState("");
  const [role, setRole] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [struggle, setStruggle] = useState("");
  const [goal, setGoal] = useState("");
  const [email, setEmail] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  // True once the anonymous auth bootstrap below has settled, success or
  // failure. Gates the final submit so it can't fire mid-bootstrap on a slow
  // connection; on failure it still flips true so the retry-on-submit path
  // in handleSubmit can kick in instead of leaving the form stuck.
  const [authChecked, setAuthChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  // Belt-and-suspenders alongside the `saving` state: a ref updates
  // synchronously, so it closes the window where a rapid double-tap (common
  // on laggy mobile UI) fires handleSubmit twice before React re-renders the
  // disabled button.
  const submittingRef = useRef(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [startingPoint, setStartingPoint] = useState<{ rankedCategories: string[]; summary: string } | null>(
    null
  );

  // Anonymous auth bootstrap: reuse the persisted session, or create one.
  useEffect(() => {
    let cancelled = false;
    ensureAnonymousUserId()
      .then((id) => {
        if (!cancelled) setUserId(id);
      })
      .catch((err) => {
        // Not fatal: submit retries, and falls back to an unsaved profile.
        console.error("Anonymous sign-in failed:", err);
      })
      .finally(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showSector = situations.some((s) => SECTOR_SITUATIONS.includes(s));
  const trimmedEmail = email.trim();
  const emailValid = trimmedEmail === "" || EMAIL_PATTERN.test(trimmedEmail);

  const canProceed =
    step === 0
      ? situations.length > 0
      : step === 1
        ? household !== "" && timeInUk !== "" && role !== ""
        : struggle.trim() !== "" && goal !== "" && emailValid;

  const isLastStep = step === TOTAL_STEPS - 1;

  function toggleSituation(label: string) {
    setSituations((prev) => (prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // authChecked guards against the upsert firing while the anonymous
    // session bootstrap (see effect above) is still in flight — plausible on
    // a slow mobile connection, where the network round trip for
    // signInAnonymously can still be pending by the time someone reaches the
    // last step.
    if (!isLastStep || !canProceed || saving || !authChecked || submittingRef.current) return;
    submittingRef.current = true;

    setSaving(true);
    setSaveFailed(false);

    // Struggle-text classification: an extra signal into computeStartingPoint(),
    // best-effort only. Isolated in its own try/catch so a failure here (network
    // issue, no match, etc.) can never block or delay the actual submission below
    // — it just falls back to computing the starting point without it.
    let struggleCategory: string | null = null;
    try {
      const res = await fetch("/api/classify-struggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ struggle: struggle.trim() }),
      });
      if (res.ok) {
        const data = (await res.json()) as { topCategory?: string | null; similarity?: number };
        if (data.topCategory && (data.similarity ?? 0) >= STRUGGLE_CATEGORY_FLOOR) {
          struggleCategory = data.topCategory;
        }
      }
    } catch (err) {
      console.error("[struggle-classify] request failed:", err);
    }

    const computed = computeStartingPoint(situations, timeInUk, role, struggleCategory);
    try {
      const id = userId ?? (await ensureAnonymousUserId());
      setUserId(id);

      // Upsert (not insert): a returning anonymous user redoing onboarding
      // updates their existing row instead of conflicting on the primary key.
      const { error } = await getSupabaseBrowser()
        .from("users")
        .upsert(
          {
            id,
            situations,
            time_in_uk: timeInUk,
            household,
            role,
            sector: showSector && sector ? sector : null,
            city: city.trim() || null,
            struggle: struggle.trim(),
            goal,
            email: trimmedEmail || null,
            ranked_categories: computed.rankedCategories,
          },
          { onConflict: "id" }
        );
      if (error) throw error;

      setSaved(true);
      setStartingPoint(computed);
    } catch (err) {
      // Full Supabase error (code/message/details), not just the generic
      // message shown to the user below — needed to diagnose failures like
      // the slow-mobile-connection reports.
      console.error("[onboarding-upsert-failed]", err);
      setSaveFailed(true);
    } finally {
      setSaving(false);
      submittingRef.current = false;
    }
  }

  // Escape hatch when saving fails: better to let someone practice with an
  // unsaved profile than to hard-block them.
  function continueWithoutSaving() {
    setStartingPoint(computeStartingPoint(situations, timeInUk, role));
  }

  if (startingPoint) {
    return (
      <div className="min-h-screen bg-paper">
        <Nav />
        <div className="mx-auto max-w-xl px-6 py-16">
          <h1 className="font-display text-3xl font-medium text-ink">Here&rsquo;s where we&rsquo;ll start</h1>
          <p className="mt-4 max-w-prose text-muted">{startingPoint.summary}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {startingPoint.rankedCategories.map((category, i) => (
              <div key={category} className="border border-line bg-white/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brick">Priority {i + 1}</p>
                <p className="mt-1 text-sm text-ink">{category}</p>
              </div>
            ))}
          </div>

          {!saved && (
            <p className="mt-6 text-xs text-muted">
              Your answers weren&rsquo;t saved this time, but you can still practice.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              const categories = encodeURIComponent(startingPoint.rankedCategories.join(","));
              const situationsParam = encodeURIComponent(situations.join(","));
              router.push(`/practice?categories=${categories}&situations=${situationsParam}`);
            }}
            className="mt-10 bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark"
          >
            Start practicing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-wide text-brick">
          Step {step + 1} of {TOTAL_STEPS}
        </p>
        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < step ? "bg-ink" : i === step ? "bg-ink/40" : "bg-line"
              }`}
            />
          ))}
        </div>

        <h1 className="mt-6 font-display text-3xl font-medium text-ink">Tell us where you're starting from</h1>
        <p className="mt-3 text-muted">
          Two minutes. This tags your profile so practice and debriefs stay relevant — nothing here is shared.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {step === 0 && (
            <fieldset>
              <legend className="text-sm font-medium text-ink">What do you deal with day to day?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SITUATIONS.map((s) => (
                  <Chip
                    key={s.label}
                    selected={situations.includes(s.label)}
                    onClick={() => toggleSituation(s.label)}
                    title={s.description}
                  >
                    {s.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <>
              <fieldset>
                <legend className="text-sm font-medium text-ink">Who do you live with?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {HOUSEHOLD.map((h) => (
                    <Chip key={h} selected={household === h} onClick={() => setHousehold(h)}>
                      {h}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium text-ink">How long have you been in the UK?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TIME_IN_UK.map((t) => (
                    <Chip key={t} selected={timeInUk === t} onClick={() => setTimeInUk(t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium text-ink">Which best describes you right now?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <Chip key={r} selected={role === r} onClick={() => setRole(r)}>
                      {r}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              {showSector && (
                <fieldset>
                  <legend className="text-sm font-medium text-ink">
                    Which sector do you work in? <span className="font-normal text-muted">(optional)</span>
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SECTORS.map((s) => (
                      <Chip key={s} selected={sector === s} onClick={() => setSector(sector === s ? "" : s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="city" className="text-sm font-medium text-ink">
                  Which city or area are you in?
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Manchester"
                  className="mt-3 w-full border border-line bg-white/60 p-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink"
                />
              </div>

              <div>
                <label htmlFor="struggle" className="text-sm font-medium text-ink">
                  What's been the most confusing so far?
                </label>
                <textarea
                  id="struggle"
                  value={struggle}
                  onChange={(e) => setStruggle(e.target.value)}
                  rows={3}
                  placeholder="e.g. I never know if my manager is actually saying yes or no"
                  className="mt-3 w-full border border-line bg-white/60 p-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink"
                />
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-ink">What&rsquo;s your main goal right now?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <Chip key={g} selected={goal === g} onClick={() => setGoal(g)}>
                      {g}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-ink">
                  Want us to reach you about a course that fits?{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!emailValid}
                  aria-describedby={!emailValid ? "email-error" : undefined}
                  className="mt-3 w-full border border-line bg-white/60 p-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink"
                />
                {!emailValid && (
                  <p id="email-error" className="mt-2 text-xs text-brick">
                    That doesn&rsquo;t look like an email address — fix it or leave it blank.
                  </p>
                )}
              </div>
            </>
          )}

          {saveFailed && (
            <div role="alert" className="border border-brick/40 bg-white/60 p-4 text-sm text-ink">
              <p>We couldn&rsquo;t save your answers just now. Your answers are still here, so you can try again.</p>
              <button
                type="button"
                onClick={continueWithoutSaving}
                className="mt-2 text-sm text-brick underline underline-offset-2 hover:text-brick-dark"
              >
                Continue without saving
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={saving}
                className="border border-line bg-white/50 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>
            )}
            {isLastStep ? (
              <button
                type="submit"
                disabled={!canProceed || saving || !authChecked}
                className="bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                {!authChecked ? "Preparing…" : saving ? "Saving…" : saveFailed ? "Try again" : "See my starting point"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed}
                className="bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
