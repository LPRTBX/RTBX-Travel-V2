# JALDO Travel — Content & Architecture Audit

**Date:** 2026-09-19
**Scope:** `LPRTBX/RTBX-Travel-V2` (the site referred to in this audit's brief as "JALDO Travel")
**Method:** Full route inventory (`docs/route-register.md`, `docs/final-page-register.md`), page-by-page source review of `artifacts/welbx/src`, data-model review (`src/data/*`), access/proof-boundary review (`docs/access-and-proof-boundaries.md`), and grep sweeps for named brands, integration claims, and governed-data patterns.

**Limitation up front:** This session only has repository access to `RTBX-Travel-V2`. I do not have access to RTBX-Main / JALDO Hub-Core, so the "duplication with the governed Travel workspace" findings below are based on (a) this repo's own architectural statements about what belongs to Core vs. Travel, and (b) first-principles comparison against the FUTURE_ROLE brief (Hub/Core owns organisation, deployment, Signal/Decision/Action/Outcome, and access control). Where I say something "duplicates Hub/Core," treat it as "this is the shape of governed data and should be verified against the actual Hub/Core workspace" rather than a confirmed byte-for-byte duplicate.

---

## 0. Naming: RTBX vs. JALDO

Every file, route, component, data model, and doc in this repository is branded **RTBX** — "RTBX Travel," "RTBX Core," "RTBX Group." A full-text search for "JALDO" across the repository returns **zero matches**.

This audit was commissioned under the name "JALDO Travel," so either:
- the RTBX→JALDO rebrand hasn't been applied to this repo yet, or
- "RTBX" is retained as an internal/engineering codename and "JALDO" is a market-facing name applied at a layer not present in this codebase.

Either way, this is worth resolving before any of the recommendations below are executed, because a content/IA audit is moot if the product name across ~60 routes is about to change. **Recommendation: get an explicit answer on rebrand timing before doing large content moves.** The rest of this audit uses "RTBX Travel" (the name actually in the code) when quoting content, and "Travel site" generically.

---

## 1. What this site currently is

`artifacts/welbx/` (directory name is legacy — the app is "RTBX Travel Partner Room") is a **single-page React/Vite/wouter app**, not a CMS-driven marketing site. Structurally:

- **~60 routes**, all under `/partner-room/*` plus a separate protected `/story/*` "Story Lab."
- **No backend.** Everything is static content plus client-side state. The one exception is a 9-stage "Build & Configure" wizard (`PartnerBuildConfigure.tsx`) and an "Execution Centre" (`PartnerOperationsCentre.tsx`) that read/write a `TravelDeploymentConfig` object to `localStorage` via `DeploymentContext.tsx`.
- **Access control is a labelled non-boundary.** `PartnerAccessGate` is a client-side code gate (`VITE_PARTNER_ROOM_CODE`); `docs/access-and-proof-boundaries.md` explicitly says "do not treat this gate as a security or access-control boundary" and documents that all content ships in the JS bundle regardless of the code.
- **All data is synthetic and self-declared as such.** `docs/access-and-proof-boundaries.md` defines a 5-level proof-boundary vocabulary (Working Proof → Simulation → Connector-ready → Integrated → Production) and states Travel is currently at "Working Proof" / "Simulation" only — "Integrated" and "Production" are marked ❌ not yet applicable anywhere in the product.
- **A large archived predecessor** (`src/archive/legacy-welbx/`, 43 files — the old WELBX GHSOL-based 32-route app with 5 fictional hotel properties) is excluded from the router and from `tsconfig.json`, and the route register/README both state it must not be restored to active routing.

This matters for the audit: the site is *already* fairly disciplined about not pretending to be more than a sales/partner proof. The risks below are less "this site lies about being live" and more "this site's interaction model looks and behaves like the real operating product, which will confuse a prospect or a live customer about where the real thing lives."

---

## 2. Findings by audit focus area

### 2.1 Hotel pilot/deployment content

Pilot and deployment content is extensive and lives across three route families:
- `/partner-room/pilot-model` + `/partner-room/resources/travel-pilot-model` (8-week pilot structure, readiness checklist, success measures — backed by `data/travelPilotModel.ts`)
- `/partner-room/rollout-model` (phased deployment model)
- `/partner-room/deployments` and its four vertical demo children (hotels-resorts, corporate-travel, events-venues, destination-tourism) plus `/partner-room/holiday-park-demo`

**`PartnerRolloutModel.tsx` already contains the clearest existing statement of the Travel-site/production boundary in the whole codebase.** It defines four stages — Working Proof, Pilot, Production Deployment, Scale Deployment — and for "Production Deployment" explicitly lists what gets added: *"Approved production integrations, Enterprise authentication and access control, Production communication dispatch, Durable audit and evidence storage, Support model and service levels, Expanded user base."* That is, in effect, a description of moving into a governed system — it just never names that system. **This is the natural anchor point to wire the JALDO Hub handoff into** (see §4).

The pilot model itself uses a fictional demo organisation (`"Harbour Hotel Melbourne — Pilot Environment"` / `"Harbour Hotel Group"` in `data/travelDeploymentConfig.ts`) — not a real customer, not IHG. No red flag here; it's clearly synthetic and clearly labelled (`synthetic: true` on the config object, "SIMULATION ACTIVE / SYNTHETIC DATA" badges rendered in the UI).

**Verdict:** Pilot/deployment *narrative* content (what a pilot involves, what production adds) is correctly scoped for a market-facing site and should stay. The *pilot-model, rollout-model, and deployment-demo pages* are sales/pathway content, not governed data, and belong here. What's missing is the explicit statement that "Production Deployment" = "your governed environment in JALDO Hub."

### 2.2 Oracle/Opera integration narrative

There is no dedicated "Oracle/Opera" page or an unqualified claim of a live/completed integration. Mentions are:
- `data/travelDeploymentPathway.ts`: `provider: "Opera Cloud / PMS provider"` — a generic integration-target field, not a specific claim.
- `data/travelDeploymentConfig.ts`: `{ id: "sys-pms", name: "Property Management System (PMS)", maturity: "simulated", notes: "Opera Cloud — connection simulated for demo" }` — explicitly labelled `simulated`.
- `data/travelPartnerEcosystem.ts`: lists `"Opera Cloud (PMS)"` and `"Agilysys (PMS / POS)"` as **examples of the kind of PMS partner** in the partner-ecosystem taxonomy, not as signed/live partners.
- `pages/partner-room/resources/TravelCommercialCase.tsx`: names "Oracle Hospitality, Agilysys, Mews, Cloudbeds" as illustrative **exit-pathway acquirer examples** in a business-case document, not integration claims.

**Verdict: no misrepresentation found.** Every Oracle/Opera reference is either (a) a generic PMS-category placeholder, or (b) explicitly tagged `simulated`/`connector-ready`-adjacent, consistent with the proof-boundary rules in `docs/access-and-proof-boundaries.md`. Nothing here claims an "Integrated" or "Production" Oracle/Opera connection. No action needed beyond continuing to enforce the existing `check:terminology` / proof-boundary discipline.

### 2.3 IHG/hotel-group positioning

Named-brand exposure is narrow and intentional:
- `StoryHub.tsx`: `const BRANDS = ["Hyatt", "Marriott", "Accor", "Hilton", "IHG-scale operators"]` — used as market-scale reference points ("operators of this scale"), not as claimed customers/partners.
- `Sidebar.tsx`: a sidebar section literally labelled "IHG PILOT" / "OPERATOR STORY LAB" gating four routes under `/story/*`.
- The IHG framing is confined to the **Story Lab** (`/story`, `/story/operator-deep-dive`, `/story/live-guest-story`), which `docs/access-and-proof-boundaries.md` explicitly scopes: *"Named brands or organisations may only appear in deliberately scoped, pre-approved pages (e.g. the IHG Pilot Story lab under `/story/*`)."*

**Verdict:** This is correctly contained per the site's own rules — one deliberately fenced narrative section, not bleeding into the general partner-facing pages. The main risk isn't misuse today, it's **governance drift**: there is no automated check (unlike `check:terminology` for legacy terms) that stops a future PR from moving IHG language out of `/story/*` into the general Partner Room. Worth adding "no named enterprise brand outside `/story/*`" to `check:terminology` or an equivalent lint.

### 2.4 Scenario walkthroughs

Scenario content is centralised in `data/travelScenarios.ts` / `data/travelPlaybooks.ts` and surfaced through many routes: `/partner-room/travel-scenarios`, `/partner-room/scenario-builder`, `/partner-room/validation-replay`, `/partner-room/product-proof/signal-capture`, and the four deployment-vertical demo pages. All scenarios are explicitly labelled synthetic (e.g. `data/travelScenarios.ts`: *"Signals are simulated — no live maintenance ticketing or PMS integration"; "Safety classification is illustrated, not assessed by a real safety system."*).

The route register itself flags **three unresolved duplicates** in this area (Sprint 3 "deferred consolidation," never executed):
- `demo-paths` + `live-demos` + `travel-demo-links` → should be one canonical demo hub (three routes currently do overlapping jobs)
- `comms-demo` should fold into `travel-ai-comms`
- `intelligence-model` is a bare alias of `travel-intelligence` that should be deleted, not redirected

**Verdict:** Scenario content itself is fine (synthetic, labelled, useful sales proof). But the site has **known, self-documented route duplication** that was deferred three sprints ago and never cleaned up. This is exactly the kind of "what should move/merge" finding the audit brief asked for — it's already been identified internally, just not actioned.

### 2.5 Partner material

Partner-facing commercial content is spread across `/partner-room/partner-ecosystem`, `/partner-room/commercial`, `/partner-room/commercial-unit`, `/partner-room/commercial-model`, and the resource library (`travel-commercial-partnership-brief`, `travel-revenue-model`, `travel-gtm-plan`, `travel-business-plan`, `travel-commercial-case`). The route register itself flags `commercial-model` as a Sprint-5 candidate to merge into `commercial-unit` — again, a self-identified but unexecuted consolidation.

`PartnerNextStep.tsx` is the strongest page in the whole site for the audit's purposes: it already structures four distinct engagement types (Operating Alignment, Integration/Technical Workshop, Pilot Design, Partner Model) with named audiences, agendas, and outputs, each ending in a `mailto:` CTA. This is legitimate market-facing "pathway to engage" content and should stay as-is on Travel.

**Verdict:** Content is appropriate for a partner-facing site; the site's own route register already flags the one real duplication (`commercial-model` vs `commercial-unit`).

### 2.6 Deployment/pilot language

Covered in 2.1. One additional observation: the vocabulary is consistent and disciplined (`Working Proof`, `Simulation`, `Connector-ready`, `Integrated`, `Production` are used the same way across `PartnerRolloutModel`, `PartnerPilotModel`, `PartnerBuildConfigure`, and the access-boundary doc). This consistency is worth preserving explicitly if content moves — it's a real asset, not boilerplate.

### 2.7 Live-looking-but-static demos

This is the sharpest finding in the audit. Two pages behave like real governed software, not marketing collateral:

- **`PartnerBuildConfigure.tsx`** — a 9-stage stepper (Environment → Systems → Roles → Operating Systems → Governance → Scenarios & Playbooks → Communications → Evidence & Outcomes → Review & Activate) that persists a full deployment configuration object to `localStorage`. Its own header comment says *"SYNTHETIC DEMONSTRATION DATA ONLY. Not a production customer environment."* — but nothing in the rendered UI stops a partner from filling in their *real* organisation name, room count, and governance rules and believing they've configured something. `DeploymentContext.tsx` even guards against loading anything that isn't `synthetic: true` from storage, which shows the team was already worried about exactly this ambiguity.
- **`PartnerOperationsCentre.tsx`** (the "RTBX Execution Centre") — a full Signal→Decide→Act→Learn runtime with evidence capture, outcome recording, communication approval gates, and escalation, all labelled "SIMULATION ACTIVE / SYNTHETIC DATA" and "Nothing is sent to any live system." It reads exactly like a governed operations console because, functionally, it is one — just wired to local state instead of a backend.

Neither page misrepresents itself (both carry live, prominent labels), so this is not a truth-in-advertising problem. It **is** an information-architecture problem for the FUTURE_ROLE requirement: *"It must NOT become the customer operating portal."* Today it doesn't hold real data, but its *shape* is the operating portal. A live customer who has been through a pilot could reasonably open this page looking for their actual action queue and be confused about which surface is real.

**Recommendation:** these two pages are good sales tools and should stay as sales tools, but should carry a persistent, explicit pointer ("this is a sales simulation — your live deployment lives in JALDO Hub at `[url]`") rather than only a "this is synthetic" disclaimer. Passive disclaimers say what it *isn't*; they don't say where the real thing *is*. That pointer is also the natural seed of the handoff mechanism requested in the brief (§4).

### 2.8 Duplication with the governed Travel workspace in RTBX-Main

I cannot inspect RTBX-Main from this session (out of scope repo). Based on this repo's own architecture statements, the duplication risk is concentrated in exactly the two pages in §2.7, plus the data model backing them:

- `data/travelOperations.ts`, `lib/runtimeEngine.ts` — implement Signal/Decision/Action/Evidence/Outcome/Value state machines client-side. If Hub/Core owns a canonical Signal Registry, Decision Spine, and Outcome Ledger (as `docs/route-register.md` and the README both assert — *"Signal registry, moment engine, decision spine and playbook library are RTBX Core components — Travel configures them"*), then this file is a **second, independent implementation of the same concepts**, not a client to the real one. That's the actual duplication, more than any specific page: the Travel site has its own toy version of the Core state machine rather than a read-only or sandboxed view of it.
- `data/travelDeploymentConfig.ts` — models organisation name, property type, room count, active operating systems, roles, governance rules. This is schema-identical in *kind* (not content) to what a real deployment record in Hub/Core would hold.

None of this is necessarily wrong for a sales demo — a demo often needs its own throwaway state to be interactive without a backend. The risk is only that nobody has documented *why* the sales-demo engine and the real Core engine are allowed to diverge, so future contributors (or worse, product content) could start treating the Travel-site engine as authoritative. **Recommendation:** add one paragraph to this repo's README (next to the existing "Preserve the shared RTBX Core architecture" rule) stating explicitly that `runtimeEngine.ts` / `travelOperations.ts` are a self-contained sales simulation with no data or code relationship to Hub/Core's real Signal/Decision/Action/Outcome systems, so nobody mistakes parity of shape for parity of source.

---

## 3. What should remain on the Travel site

Everything under "Canonical Partner Room routes," "Proof and validation routes," "Resource routes," and the Story Lab in `docs/final-page-register.md` is appropriately market/partner-facing and should stay:
- Product narrative: overview, operator brief, operating model, travel intelligence, travel operating systems, integration brief, signals/decision-spine briefs
- Scenario/demo proof: product-proof, validation, guest/operator/dual-view demos, the four deployment-vertical demos, scenario builder
- Pilot/deployment pathway narrative: pilot-model, rollout-model
- Commercial/partner content: commercial, commercial-unit, partner-ecosystem, resource library
- Engagement pathway: next-step
- Story Lab (fenced, pre-approved brand references)

This is the correct shape for "explain and sell the Travel proposition" per the brief.

## 4. What duplicates Hub/Core and should not become the operating surface

- `PartnerBuildConfigure` and `PartnerOperationsCentre` (§2.7) — keep as interactive sales demos, but they should never be the place a real customer configures or operates their deployment. Today they aren't (no backend, no auth, no real data path in or out) — the risk is purely architectural drift and prospect confusion, not a current leak of real data.
- `data/travelOperations.ts` / `lib/runtimeEngine.ts` — the client-side Signal/Decision/Action/Evidence/Outcome/Value engine (§2.8) should be explicitly documented as a standalone simulation, not a preview of, or client to, the real Core engine.
- `DeploymentContext` (`localStorage`-only deployment state) should never be the mechanism by which a real customer's deployment configuration is captured. If a prospect currently uses Build & Configure to sketch a real deployment during a Pilot Design Session (which `PartnerNextStep.tsx` implies — "Pilot Design Session" output includes "Signed pilot scope... role map, system maturity map"), that output today lives only in one browser's `localStorage` and is exported via a manual JSON copy-paste (`exportDeployment()` in `DeploymentContext.tsx`). That's a real operational gap, not just a naming one: there is no path from "what the prospect configured in the demo" into any system of record.

## 5. What should move / be consolidated (independent of Hub/Core)

These are Travel-internal cleanups, not Hub/Core boundary issues — but they're exactly the kind of "what remains, what should move" question the brief asked, so listing them together:

1. Merge `demo-paths` + `live-demos` + `travel-demo-links` into one canonical demo hub (self-identified in route register, Sprint 3, never done).
2. Fold `comms-demo` into `travel-ai-comms` (same status).
3. Delete the `intelligence-model` alias route entirely rather than keep redirecting it.
4. Merge `commercial-model` into `commercial-unit` (self-identified, Sprint 5, never done).
5. Decide canonical placement for `proof-calculator` and `moments-economy` (currently listed as "evaluate," unresolved).
6. Resolve the RTBX/JALDO naming question (§0) before any further content work, since it affects every page.

## 6. Recommended customer handoff into JALDO Hub

Nothing in the current codebase names a destination system for a graduating pilot/production customer. `PartnerRolloutModel.tsx`'s "Production Deployment" stage is the correct conceptual seam — it already lists exactly the capabilities (auth, access control, durable audit/evidence storage, support model) that live in a governed Hub. Concretely, I'd recommend:

1. **Name the destination explicitly** in `PartnerRolloutModel.tsx` and `PartnerPilotModel.tsx`: "Production Deployment" copy should state that from this stage on, the customer's governed environment is JALDO Hub, with the Travel site continuing to serve as the reference/sales/partner environment — not as the place work happens.
2. **Add an exit affordance** on `PartnerOperationsCentre` and `PartnerBuildConfigure`: once a deployment reaches the "Pilot" or "Production" stage in real life, the on-page synthetic banner should link to "your live environment in JALDO Hub" rather than only saying "this is not connected to any live system."
3. **Define what actually crosses the boundary.** Today a Pilot Design Session's output (scope, roles, governance rules, success measures) has no defined path into Hub/Core other than manual re-entry. Decide whether the Build & Configure wizard's `exportDeployment()` JSON should become a real, supported input format for Hub/Core's deployment provisioning (even if only as an internal-team import used during onboarding, not a customer-facing sync) — otherwise the "Pilot Design Session" promise of a "signed pilot scope... role map, system maturity map" as an *output* is only ever a document, never a configured system.
4. **Keep identity/access strictly on the Hub side.** Nothing here recommends adding real authentication or RBAC to the Travel site — the FUTURE_ROLE brief is correct that this site should stay a public/partner reference. The `VITE_PARTNER_ROOM_CODE` gate is fine for its stated purpose (casual-discovery deterrence) and should not be upgraded to look like real access control, which would blur the boundary this whole audit is trying to sharpen.

---

## Summary table

| Area | Verdict | Action |
|---|---|---|
| Hotel pilot/deployment narrative | Correctly scoped, synthetic, labelled | Keep; add explicit Hub handoff language |
| Oracle/Opera integration claims | No misrepresentation found | No action beyond existing terminology checks |
| IHG/hotel-group positioning | Correctly fenced to `/story/*` | Add a lint/check so it can't leak into general pages |
| Scenario walkthroughs | Content fine; routing has known unresolved duplication | Execute the Sprint 3/5 consolidations already logged in the route register |
| Partner material | Appropriate for a partner site | Merge `commercial-model` into `commercial-unit` |
| "Live-looking" but static demos | `PartnerBuildConfigure` + `PartnerOperationsCentre` behave like the operating portal in shape, though clearly labelled synthetic | Keep as sales tools; add explicit "your real environment is in JALDO Hub" pointers; document the engine as a standalone simulation |
| Duplication with governed Core | Cannot verify against RTBX-Main directly; this repo's own client-side Signal/Decision/Action/Outcome engine duplicates Core's *concepts* by design | Document explicitly as non-authoritative; do not let it become a second source of truth |
| Customer handoff mechanism | Does not exist today, even conceptually named | Name JALDO Hub as the destination at the Production Deployment stage; define what data (if any) crosses from a Pilot Design Session into Hub provisioning |
| Branding | 100% "RTBX", 0% "JALDO" across the whole repo | Resolve before further content work |
