import { NormEntry } from "@/lib/mock-data";

export default function NormCard({ entry }: { entry: NormEntry }) {
  return (
    <div className="w-full max-w-md border border-line bg-white/60 p-6 shadow-[4px_4px_0_#1C2733]">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">{entry.normId}</span>
        <span className="text-xs text-muted">{entry.category}</span>
      </div>
      <p className="mt-4 font-display text-lg italic text-ink">{entry.surfaceMarkers}</p>
      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brick">What it actually means</p>
        <p className="text-sm leading-relaxed text-ink">{entry.whatItMeans}</p>
      </div>
    </div>
  );
}
