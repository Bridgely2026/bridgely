"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import CategoryIcon from "@/components/CategoryIcon";
import { CATEGORY_BLURBS, getCategoryScenarioCounts, getScenariosByCategory } from "@/lib/mock-data";
import { getStreak, incrementStreak } from "@/lib/streak";

type View = "picker" | "session" | "recap";

function pickCategoryWithScenarios(rankedCategories: string[]): string | null {
  for (const category of rankedCategories) {
    if (getScenariosByCategory(category).length > 0) return category;
  }
  return null;
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const categoriesParam = searchParams.get("categories");
  const rankedCategories = categoriesParam ? categoriesParam.split(",").filter(Boolean) : [];

  const initialCategory = pickCategoryWithScenarios(rankedCategories);
  const initialNoteCategory = rankedCategories.length > 0 && !initialCategory ? rankedCategories[0] : null;

  const [view, setView] = useState<View>(initialCategory ? "session" : "picker");
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [prioritizedCategory] = useState<string | null>(initialCategory);
  const [noteCategory, setNoteCategory] = useState<string | null>(initialNoteCategory);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; feedback: string; normId: string } | null>(
    null
  );
  const [barVisible, setBarVisible] = useState(false);

  // The feedback bar is `fixed inset-x-0 bottom-0`, so it's out of document
  // flow and can overlap the last option on narrow viewports unless the
  // scrollable content above reserves space for it. Its height varies with
  // feedback text length (longer explanations wrap to more lines on a narrow
  // phone), so it's measured via ResizeObserver rather than guessed as a
  // single fixed value — see feedbackBarHeight usage below.
  const feedbackBarRef = useRef<HTMLDivElement>(null);
  const [feedbackBarHeight, setFeedbackBarHeight] = useState(0);

  const [streak, setStreak] = useState(0);
  useEffect(() => {
    setStreak(getStreak());
  }, []);

  // Attaches once per session as soon as the bar first mounts (lastAnswer
  // goes null -> set on the first answered question) and stays attached for
  // the rest of the session, since the bar's DOM node persists across
  // questions (only its content/visibility change) — so this alone also
  // catches height changes from viewport resize or text rewrap, not just the
  // initial measurement.
  useEffect(() => {
    const el = feedbackBarRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setFeedbackBarHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [lastAnswer !== null]);

  const categoryCounts = getCategoryScenarioCounts();
  const categoryScenarios = activeCategory ? getScenariosByCategory(activeCategory) : [];
  const scenario = categoryScenarios[currentIndex];
  const step = scenario?.steps[0];

  function startSession(category: string) {
    setActiveCategory(category);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setLastAnswer(null);
    setBarVisible(false);
    setNoteCategory(null);
    setView("session");
  }

  function choose(i: number) {
    if (selected !== null || !step || !scenario) return;
    const opt = step.options[i];
    setSelected(i);
    if (opt.correct) setCorrectCount((c) => c + 1);
    setLastAnswer({ correct: opt.correct, feedback: opt.feedback, normId: scenario.normId });
    requestAnimationFrame(() => setBarVisible(true));
  }

  function goToNextOrRecap() {
    setBarVisible(false);
    if (currentIndex + 1 < categoryScenarios.length) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setStreak(incrementStreak());
      setView("recap");
    }
  }

  function practiceAnotherCategory() {
    setActiveCategory(null);
    setNoteCategory(null);
    setBarVisible(false);
    setView("picker");
  }

  function restartCategory() {
    if (activeCategory) startSession(activeCategory);
  }

  const streakLine = <p className="text-sm text-muted">🔥 {streak} day streak</p>;

  if (view === "picker") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-brick">Practice</p>
          {streakLine}
        </div>

        <h1 className="mt-2 font-display text-2xl font-medium text-ink">Choose a category</h1>

        {noteCategory && (
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brick">
            We don&apos;t have practice scenarios for {noteCategory} yet — pick another to get started
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {categoryCounts.map(({ category, count }) => {
            const disabled = count === 0;
            const categoryScenarioList = getScenariosByCategory(category);
            const allProvisional = count > 0 && categoryScenarioList.every((s) => s.provisional);
            return (
              <button
                key={category}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && startSession(category)}
                className={`border p-4 text-left transition ${
                  disabled
                    ? "cursor-not-allowed border-line bg-white/30 opacity-50"
                    : "border-line bg-white/60 hover:border-ink"
                }`}
              >
                <CategoryIcon category={category} className="h-6 w-6 text-ink" />
                <p className="mt-3 font-display text-lg font-medium text-ink">{category}</p>
                <p className="mt-1 text-sm text-muted">{CATEGORY_BLURBS[category]}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brick">
                  {disabled
                    ? "No scenarios yet — coming soon"
                    : `${count} scenario${count === 1 ? "" : "s"}${allProvisional ? " · pending review" : ""}`}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "recap") {
    const total = categoryScenarios.length;
    const ratio = total > 0 ? correctCount / total : 0;
    const message =
      ratio === 1
        ? "All correct — that's exactly the instinct you want here."
        : ratio === 0
          ? "Worth another look — everyone needs a few passes at these."
          : "Good start — a couple worth revisiting when you're ready.";
    const normIds = categoryScenarios.map((s) => s.normId).join(", ");

    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-brick">Practice</p>
          {streakLine}
        </div>

        {activeCategory && (
          <p className="mt-6 text-xs font-medium uppercase tracking-wide text-brick">{activeCategory}</p>
        )}
        <h1 className="mt-2 font-display text-2xl font-medium text-ink">Session complete</h1>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-display text-6xl font-medium text-ink">{correctCount}</span>
          <span className="text-lg text-muted">/ {total} correct</span>
        </div>

        <p className="mt-3 text-muted">{message}</p>

        <div className="mt-8 space-y-1">
          <p className="text-sm text-muted">🔥 {streak} day streak</p>
          <p className="text-xs text-muted">
            Practiced: <span className="font-mono">{normIds}</span>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={practiceAnotherCategory}
            className="bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark"
          >
            Practice another category
          </button>
          <button
            type="button"
            onClick={restartCategory}
            className="border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
          >
            Back to this category
          </button>
        </div>
      </div>
    );
  }

  if (!scenario || !step) return null;

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-brick">Practice</p>
        {streakLine}
      </div>

      {activeCategory && prioritizedCategory === activeCategory && (
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brick">
          Prioritized for you: {activeCategory}
        </p>
      )}

      {scenario.provisional && (
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brick">
          Drafted from an unreviewed taxonomy entry — not yet approved by the founder
        </p>
      )}

      <div className="mt-4 flex gap-1.5">
        {categoryScenarios.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < currentIndex ? "bg-ink" : i === currentIndex ? "bg-ink/40" : "bg-line"
            }`}
          />
        ))}
      </div>

      <h1 className="mt-4 font-display text-2xl font-medium text-ink">{scenario.title}</h1>

      <div
        className="mt-8 border border-line bg-white/60 p-6"
        // Reserves room for the fixed feedback bar below once it's shown, so
        // the last option never ends up hidden behind it — see
        // feedbackBarHeight's ResizeObserver setup above. 112px matches the
        // bar's typical single-line height as a fallback before the first
        // measurement resolves; +24 is breathing room above the bar itself.
        style={lastAnswer ? { paddingBottom: (feedbackBarHeight > 0 ? feedbackBarHeight + 24 : 112) + "px" } : undefined}
      >
        <p className="text-sm leading-relaxed text-muted">{scenario.setup}</p>
        <p className="mt-4 font-display text-lg italic text-ink">{step.prompt}</p>

        <div className="mt-6 space-y-3">
          {step.options.map((opt, i) => {
            const isChosen = selected === i;
            const showState = selected !== null;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={`flex w-full items-center gap-3 border p-4 text-left text-sm transition ${
                  showState && isChosen && opt.correct
                    ? "border-sage bg-sage-light text-ink"
                    : showState && isChosen && !opt.correct
                      ? "border-brick bg-brick/10 text-ink"
                      : "border-line bg-white text-ink hover:border-ink disabled:hover:border-line"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                    showState && isChosen && opt.correct
                      ? "border-sage text-sage"
                      : showState && isChosen && !opt.correct
                        ? "border-brick text-brick"
                        : "border-line"
                  }`}
                >
                  {i + 1}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {lastAnswer && (
        <div
          ref={feedbackBarRef}
          className={`fixed inset-x-0 bottom-0 border-t transition-transform duration-300 ease-out ${
            barVisible ? "" : "translate-y-full"
          } ${lastAnswer.correct ? "border-sage bg-sage-light" : "border-brick bg-brick/10"}`}
        >
          <div className="mx-auto flex max-w-2xl items-start gap-4 px-6 py-5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-paper ${
                lastAnswer.correct ? "bg-sage" : "bg-brick"
              }`}
            >
              {lastAnswer.correct ? "✓" : "✕"}
            </span>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${lastAnswer.correct ? "text-sage" : "text-brick"}`}>
                {lastAnswer.correct ? "That lands well" : "Not quite"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{lastAnswer.feedback}</p>
              <p className="mt-2 text-xs text-muted">
                Based on norm <span className="font-mono">{lastAnswer.normId}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={goToNextOrRecap}
              className="shrink-0 self-center bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark"
            >
              {currentIndex + 1 < categoryScenarios.length ? "Next question" : "See results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <Suspense fallback={null}>
        <PracticeContent />
      </Suspense>
    </div>
  );
}
