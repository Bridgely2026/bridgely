# Bridgely

Landing page + app shell. Next.js 14 (App Router) + Tailwind, matching the stack
locked in the project doc. Everything here runs against mock data in
`lib/mock-data.ts` — no Supabase or Claude API calls yet, by design (see the
project doc's build-order note).

## Routes

- `/` \u2014 landing page (hero, three features, credibility, CTA)
- `/onboarding` \u2014 profile form (feature 1), stores nothing yet, just routes on
- `/practice` \u2014 tap-based scenario roleplay (feature 2), one hardcoded scenario
- `/debrief` \u2014 describe-a-situation \u2192 structured output (feature 3), mocked classifier

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

```
npm i -g vercel
vercel
```

Or push to a GitHub repo and import it in the Vercel dashboard \u2014 zero config
needed, it's a stock Next.js app.

## Next steps (per the build-order plan)

1. UI is stable \u2014 stand up the real Supabase schema (`users`, `scenarios`,
   `conversations`, `debriefs`, `taxonomy_entries` w/ pgvector).
2. Swap `lib/mock-data.ts` reads for Supabase queries, route by route.
3. Wire the Claude API: scenario-practice conversation generation, and the
   debrief tool's RAG classification (replacing `mockDebrief`).
4. Onboarding form submit \u2192 write to `users` table instead of just routing on.
