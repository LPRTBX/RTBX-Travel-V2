# RTBX Travel Partner Room V2

**Product:** RTBX Travel Partner Room  
**Part of:** RTBX Group shared platform  
**Repository:** `LPRTBX/RTBX-Travel-V2`  
**Maturity:** Interactive front-end product proof and partner environment  
**Sprint:** V2 Sprint 1 complete (Repository and Architecture Stabilisation)

---

## Product identity

RTBX Travel is the travel and hospitality operating vertical, powered by RTBX Core. It turns live guest, operator and service-moment signals into governed responses, coordinated actions and measurable outcomes across hotels, resorts, holiday parks and experience environments.

This repository contains the **RTBX Travel Partner Room** — a strategic partner and operator environment for reviewing the product, its operating architecture, commercial model and deployment pathway.

RTBX Travel supports configurable guest-facing experiences as part of its Execution and Communication Layer. It does not introduce a separate guest platform.

---

## Application structure

```
artifacts/welbx/          # Active RTBX Travel Partner Room application (legacy directory name)
  src/
    App.tsx               # Router (wouter) — canonical route table
    main.tsx              # Entry point
    pages/
      partner-room/       # Partner Room page components
        resources/        # Resource library page components
      StoryHub.tsx        # Story Lab (protected, pre-approved brand references)
      StoryOperator.tsx
      StoryGuestStory.tsx
    archive/
        legacy-welbx/       # Archived historical pages — NOT part of active routing
    components/
      PartnerRoomLayout.tsx   # Partner Room nav, header, footer
      PartnerAccessGate.tsx   # Front-end MVP access gate
       Sidebar.tsx             # Legacy sidebar (Story Lab use only)
      GlobalSearch.tsx        # Global search index
    context/              # React context providers
    data/                 # Centralised data files (travelIntelligence.ts etc.)
    lib/                  # Utilities and content types
    scripts/              # QA and verification scripts (see below)
  public/                 # Static assets (favicon.svg, opengraph.jpg)
  index.html              # App shell
  package.json            # Artifact package config
  tsconfig.json           # TypeScript config (excludes src/archive)
  vite.config.ts          # Vite build config

docs/
  route-register.md             # Canonical route register
  access-and-proof-boundaries.md  # Access gate and proof boundary documentation

.github/
  workflows/
    travel-qa.yml         # CI: typecheck, test, check:legacy, routes, links, build
```

---

## Commands

Run all commands from the workspace root unless noted.

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm --filter @workspace/rtbx-travel run dev` | Start development server |
| `pnpm --filter @workspace/rtbx-travel run typecheck` | TypeScript typecheck |
| `pnpm --filter @workspace/rtbx-travel run test` | Run tests (vitest) |
| `pnpm --filter @workspace/rtbx-travel run test:routes` | Verify all App.tsx imports resolve |
| `pnpm --filter @workspace/rtbx-travel run test:links` | Verify internal links resolve to routes |
| `pnpm --filter @workspace/rtbx-travel run check:terminology` | Check active terminology |
| `pnpm --filter @workspace/rtbx-travel run check:assets` | Check public assets exist |
| `pnpm --filter @workspace/rtbx-travel run build` | Production build |
| `pnpm --filter @workspace/rtbx-travel run serve` | Preview production build |

### Shortcuts (from `artifacts/welbx/`)

```bash
cd artifacts/welbx
pnpm run dev
pnpm run typecheck
pnpm run test
pnpm run test:routes
pnpm run test:links
pnpm run check:legacy
pnpm run check:assets
pnpm run build
```

---

## Node and package manager

| Requirement | Version |
|-------------|---------|
| Node.js | `>=24.0.0` (see `.nvmrc`) |
| pnpm | `>=10.0.0` (enforced via `packageManager` field) |

---

## Repository rules

1. **Do not restore archived historical pages into active routing.** The archive is not part of the current product and must not be imported into production routes.
2. **Do not create duplicate routes.** Every product concept has one canonical route. See `docs/route-register.md`.
3. **Do not represent simulated data as a production integration.** All demo content is synthetic. Use the proof boundary definitions in `docs/access-and-proof-boundaries.md`.
4. **Do not add a new page where an existing canonical page can be extended.**
5. **Update the route register** (`docs/route-register.md`) when routes change.
6. **Preserve the shared RTBX Core architecture.** Travel is a configured vertical, not a rebuild.
7. **Vertical configuration must not redefine RTBX Core.** Signal registry, moment engine, decision spine and playbook library are RTBX Core components — Travel configures them.
8. **Run `check:legacy` before merging** to prevent legacy terminology re-entering active source.

---

## Access and proof boundaries

See `docs/access-and-proof-boundaries.md` for full documentation.

**Summary:** The Partner Room uses a client-side MVP access gate (`VITE_PARTNER_ROOM_CODE`). This is not a security boundary. All content is synthetic demonstration data unless explicitly labelled otherwise.

---

## Deferred work

| Sprint | Focus |
|--------|-------|
| Sprint 2 | RTBX Core terminology alignment (BXOS → Signal Engine, NEXUS → Routing Layer, etc.) |
| Sprint 3 | Demo and scenario consolidation |
| Sprint 4 | Build, Configure and Execute pathway |
| Sprint 5 | Partner and commercial pathway consolidation |
| Sprint 6 | Final release QA |
