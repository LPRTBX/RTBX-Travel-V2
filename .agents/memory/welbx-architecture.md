---
name: WELBX Architecture
description: Key design decisions, data conventions, and TS gotchas for the WELBX Travel Operating Layer app
---

## Stack
React + Vite + Tailwind + Framer Motion + Recharts + Lucide + Wouter. No new packages can be added.

## Design tokens
- bg: `hsl(220 13% 5%)`, amber: `#c9a84c`, green: `#10b981`, red: `#ef4444`, blue: `#3b82f6`, violet: `#a78bfa`, cyan: `#22d3ee`
- Sidebar: `w-56` (224px). Regular pages: `className="pl-56 min-h-screen"`. Full-screen overlays: `position: fixed; inset: 0; z-index: 60`.
- Zero border-radius, no emojis in operational UI.

## Navigation structure (Sidebar.tsx)
GHSOL-aligned sections: SIGNALS → MOMENTS → DECISIONS → EXECUTION → COMMUNICATIONS → OUTCOMES → VALUE → PLATFORM.
Hero section below (GHSOL, Live Demo, Comparison, Command Mode).

## AppContext (src/context/AppContext.tsx)
Fields: `vipResolved`, `resolveVIP`, `flowStep`, `vectorExecuting`, `momentCount`, `activeProperty` (PropertyId), `setActiveProperty`, `activeRole` (RoleId), `setActiveRole`, `activePeriod` (PeriodId), `setActivePeriod`, `searchOpen`, `setSearchOpen`.

## Shared entities (src/data/entities.ts)
`PROPERTIES` (5 hotels), `ROLES` (gm/ops/commercial/director), `PERIODS` (7d/30d/90d), canonical `MOMENT_IDS` and `SIGNAL_IDS`.

## Global search (src/components/GlobalSearch.tsx)
Cmd+K overlay. Reads `searchOpen` from AppContext. All 32 pages indexed with section and description. Arrow-key navigation.

## TypeScript gotchas
- `setInterval` in this environment returns `NodeJS.Timeout`. Use `ReturnType<typeof setTimeout> | undefined` for refs.
- Optional useEffect cleanup: use early `return;` pattern rather than `if (cond) { return cleanup; }` to avoid TS7030.
- Union types without a field: use `(m as { field?: type }).field ?? fallback` rather than direct access.
- `moments.ts` Moment interface now has `commercialValue?: string` (optional) to cover m6 data.

## Key pages
- LearningLayer (`/learning-layer`): GHSOL step 6 — 7 learning events, 6 institutional patterns, 4 protocol updates
- CausalTrace (`/causal-trace`): Master-detail, 6 SEEDED_MOMENTS each with full 6-stage GHSOL chain (click to expand)
- ValueProof (`/value-proof`): Board-ready ROI — 6 KPIs, 3 charts (bar/trend/radar), 5-property table, period-aware (reads activePeriod from AppContext)

**Why:** AppContext period selector in ValueProof is intentional — the period toggle updates global context so other pages can also respond to period changes consistently.
