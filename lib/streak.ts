const STREAK_KEY = "bridgely_streak";

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STREAK_KEY);
  const parsed = raw === null ? NaN : Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function incrementStreak(): number {
  const next = getStreak() + 1;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STREAK_KEY, String(next));
  }
  return next;
}
