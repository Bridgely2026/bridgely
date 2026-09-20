import Link from "next/link";
import Nav from "@/components/Nav";
import NormCard from "@/components/NormCard";
import { taxonomy } from "@/lib/mock-data";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Nav />

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <h1 className="font-display text-4xl font-medium leading-[1.1] text-ink md:text-5xl">
            You understood every word.
            <br />
            You still missed what they meant.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
            Bridgely teaches the unwritten rules of British communication — the hedges, the
            understatements, the &ldquo;let&rsquo;s see how it goes&rdquo; that actually means no.
            Practice before it happens. Get a straight answer after it already has.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/onboarding"
              className="bg-brick px-6 py-3 text-sm font-medium text-paper transition hover:bg-brick-dark"
            >
              Start your profile
            </Link>
            <Link href="/debrief" className="text-sm font-medium text-ink underline underline-offset-4">
              Try the debrief tool
            </Link>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <NormCard entry={taxonomy[0]} />
        </div>
      </section>

      {/* Three features */}
      <section className="border-y border-line bg-white/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-display text-2xl font-medium text-ink">Two moments. One method.</h2>
          <p className="mt-3 max-w-prose text-muted">
            Every feature comes from the same place: a taxonomy of real British communication
            patterns, built by a working cultural-communication coach — not generated, not scraped.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <Feature
              label="Before it happens"
              title="Practice"
              body="Tap-based roleplay built from real scenarios. Respond to a manager, a landlord, a new colleague — and see, in the moment, whether your instinct was right."
            />
            <Feature
              label="After it happens"
              title="Debrief"
              body="Describe a confusing moment — by voice or text. Get back exactly what was really meant, why, and what to say next. No need to already know what category it falls under."
            />
            <Feature
              label="Ongoing"
              title="A profile that adapts"
              body="A short onboarding tells Bridgely your sector, your situation, your struggle — so practice and debriefs stay relevant to your actual life, not generic advice."
            />
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-start">
          <h2 className="font-display text-2xl font-medium text-ink">Built on real coaching, not guesses</h2>
          <div className="space-y-4 text-muted">
            <p>
              Every entry in Bridgely&rsquo;s library comes from a real client case, reviewed and
              written by a working cultural-communication coach — the same methodology behind
              years of 1:1 sessions, now built into software instead of replaced by it.
            </p>
            <p>
              Nothing gets published without review. The library grows the same way it always has:
              one grounded, specific case at a time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-2xl font-medium text-paper">
            Stop guessing what people mean.
          </h2>
          <Link
            href="/onboarding"
            className="bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            Start your profile
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-brick">{label}</p>
      <h3 className="mt-2 font-display text-xl font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
