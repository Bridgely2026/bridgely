import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl font-medium tracking-tight text-ink">
          Bridgely
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/onboarding" className="hover:text-ink">
            Get started
          </Link>
          <Link href="/practice" className="hover:text-ink">
            Practice
          </Link>
          <Link href="/debrief" className="hover:text-ink">
            Debrief
          </Link>
        </nav>
      </div>
    </header>
  );
}
