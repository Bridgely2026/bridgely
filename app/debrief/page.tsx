"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { taxonomy } from "@/lib/mock-data";

type MatchedResult = {
  likely_norm: string;
  surface_signal: string;
  what_it_means: string;
  suggested_response: string;
};

type FollowUp = { question: string; answer: string };

type Phase =
  | { kind: "form" }
  | { kind: "follow_up"; question: string }
  | { kind: "matched"; result: MatchedResult }
  | { kind: "no_match"; message: string };

export default function DebriefPage() {
  const [description, setDescription] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "form" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function callDebrief(followUp?: FollowUp) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, followUp }),
      });
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      if (data.status === "needs_follow_up") {
        setFollowUpAnswer("");
        setPhase({ kind: "follow_up", question: data.question });
      } else if (data.status === "matched") {
        setPhase({ kind: "matched", result: data.result });
      } else if (data.status === "no_match") {
        setPhase({ kind: "no_match", message: data.message });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description.trim() || loading) return;
    setSaved(false);
    callDebrief();
  }

  function handleFollowUpSubmit(e: FormEvent, question: string) {
    e.preventDefault();
    if (!followUpAnswer.trim() || loading) return;
    callDebrief({ question, answer: followUpAnswer });
  }

  function startOver() {
    setPhase({ kind: "form" });
    setDescription("");
    setFollowUpAnswer("");
    setError(null);
    setSaved(false);
  }

  const matchedCategory =
    phase.kind === "matched" ? taxonomy.find((e) => e.normId === phase.result.likely_norm)?.category : undefined;

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-wide text-brick">Debrief</p>
        <h1 className="mt-2 font-display text-2xl font-medium text-ink">What happened?</h1>
        <p className="mt-3 text-muted">
          Describe a moment that confused you — in your own words. No need to know what category it
          falls under.
        </p>

        {phase.kind === "form" && (
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="e.g. My landlord said he'd 'sort it when he gets a chance' about the broken boiler and it's been three weeks"
                className="w-full border border-line bg-white/60 p-4 pr-12 text-sm text-ink placeholder:text-muted/70 focus:border-ink"
              />
              <button
                type="button"
                title="Voice input (not wired up in this shell)"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-muted"
              >
                🎤
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="mt-4 bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Thinking…" : "Explain this"}
            </button>
          </form>
        )}

        {phase.kind === "follow_up" && (
          <form
            onSubmit={(e) => handleFollowUpSubmit(e, phase.question)}
            className="mt-10 border border-line bg-white/60 p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-brick">One quick check</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{phase.question}</p>
            <textarea
              value={followUpAnswer}
              onChange={(e) => setFollowUpAnswer(e.target.value)}
              rows={3}
              placeholder="Your answer"
              className="mt-4 w-full border border-line bg-white p-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink"
            />
            <button
              type="submit"
              disabled={loading || !followUpAnswer.trim()}
              className="mt-4 bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Thinking…" : "Send"}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-6 border border-brick bg-brick/10 p-4">
            <p className="text-sm text-ink">{error}</p>
          </div>
        )}

        {phase.kind === "no_match" && (
          <div className="mt-10 border border-line bg-white/60 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-brick">No close match yet</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{phase.message}</p>
            <button
              type="button"
              onClick={startOver}
              className="mt-6 text-xs font-medium text-ink underline underline-offset-4"
            >
              Try describing it differently
            </button>
          </div>
        )}

        {phase.kind === "matched" && (
          <div className="mt-10 border border-line bg-white/60 p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wide text-muted">
                {phase.result.likely_norm}
              </span>
              {matchedCategory && <span className="text-xs text-muted">{matchedCategory}</span>}
            </div>

            <Field label="Surface signal" value={phase.result.surface_signal} italic />
            <Field label="What it actually means" value={phase.result.what_it_means} />
            <Field label="Suggested response" value={phase.result.suggested_response} />

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
              <Link href="/practice" className="bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-ink/90">
                Practice this norm
              </Link>
              <button
                onClick={() => setSaved(true)}
                className="text-xs font-medium text-ink underline underline-offset-4"
              >
                {saved ? "Saved to your log" : "Save to my log"}
              </button>
              <button
                type="button"
                onClick={startOver}
                className="text-xs font-medium text-ink underline underline-offset-4"
              >
                Describe another moment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, italic }: { label: string; value: string; italic?: boolean }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-brick">{label}</p>
      <p className={`mt-1 text-sm leading-relaxed text-ink ${italic ? "font-display italic" : ""}`}>{value}</p>
    </div>
  );
}
