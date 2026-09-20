# RTBX Travel Partner Room — Access Boundary Register

**Owner:** RTBX  
**Last reviewed:** 29 August 2026  
**Release classification:** Controlled Partner Preview · Working Proof · Simulation

## Boundary statement

The access-code screen is a client-side demonstration gate for guided review. It is not authentication and does not create confidentiality. Anything registered in the external route tree or imported by that tree must be suitable for delivery to anyone who can retrieve the static client bundle.

Restricted and internal-only material is therefore excluded from `App.tsx`, the external resource manifest, and the production bundle. Hiding a card or navigation item is not sufficient.

## Approved external route classes

| Access level | Approved routes and route families |
|---|---|
| Public | `/`, `/story`, `/story/operator`, `/story/guest` |
| General Partner | `/partner-room`, `/partner-room/overview`, `/partner-room/product-proof`, `/partner-room/brief-library`, `/partner-room/next-step`, `/partner-room/moments-economy`, `/partner-room/demo-paths`, `/partner-room/live-demos`, `/partner-room/guest-demo`, `/partner-room/dual-view-demo`, `/partner-room/comms-demo`, `/partner-room/proof-calculator` |
| Pilot Partner | `/partner-room/pilot-model`, `/partner-room/build-configure`, `/partner-room/operations`, `/partner-room/travel-scenarios`, `/partner-room/travel-scenarios/:scenarioId`, `/partner-room/validation-replay`, `/partner-room/operator-demo` |
| Technical Partner | `/partner-room/validation`, `/partner-room/integration-brief`, `/partner-room/signals-engine`, `/partner-room/scenario-builder`, `/partner-room/decision-spine`, `/partner-room/operating-model`, `/partner-room/intelligence-model`, `/partner-room/travel-intelligence`, `/partner-room/travel-operating-systems`, `/partner-room/travel-ai-comms`, `/partner-room/product-proof/signal-capture`, `/partner-room/product-proof/stage-3-operating-layer`, `/partner-room/product-proof/pilot-expansion-preview` |
| Deployment Partner | `/partner-room/deployments`, `/partner-room/operator-brief`, `/partner-room/partner-ecosystem`, `/partner-room/rollout-model`, `/partner-room/holiday-park-demo`, `/partner-room/deployments/*/demo` |
| Compatibility aliases | `/travel-scenarios`, `/travel-scenarios/:scenarioId`, `/travel-intelligence`, `/travel-operating-systems`, `/travel-ai-comms`, `/travel-action-centre`, `/travel-outcomes`, `/travel-value` |

## Approved external resource routes

These appendix pages are approved and are present in the external bundle:

| Route | Access level |
|---|---|
| `/partner-room/resources/travel-partnership-overview` | General Partner |
| `/partner-room/resources/travel-pilot-model` | Pilot Partner |
| `/partner-room/resources/travel-ux-blueprint` | Technical Partner |
| `/partner-room/resources/travel-systems-map` | Technical Partner |
| `/partner-room/resources/travel-ai-intelligence-layer` | Technical Partner |
| `/partner-room/resources/travel-architecture-modelling-ux-qa` | Technical Partner |
| `/partner-room/resources/travel-demo-links` | General Partner |

The Brief Library also links to approved canonical pages. Every displayed resource declares an owner, version, access level, maturity, last-reviewed date, route identifier, audience, and tags in the canonical external manifest.

## Excluded material

| Source material | Classification | External status |
|---|---|---|
| Business Plan | Internal Only | Source retained; no route, manifest entry, or client import |
| Go-to-Market Plan | Internal Only | Source retained; no route, manifest entry, or client import |
| Public Story Lab hub and walkthroughs | Public | Registered only at `/story`, `/story/operator` and `/story/guest` |
| Commercial Pathway | Commercially Restricted | Source retained; no route, navigation item, client import or bundle content |
| Revenue Model | Commercially Restricted | Source retained; no route, manifest entry, or client import |
| Commercial Partnership Brief | Commercially Restricted | Source retained; no route, manifest entry, or client import |
| Commercial Case | Commercially Restricted | Source retained; no route, manifest entry, or client import |
| Commercial Unit | Commercially Restricted | Source retained; no route, manifest entry, or client import |

Restricted source files are deliberately not linked from active external pages. Access requires a separately controlled delivery mechanism and content review; the current client-side gate is insufficient.

## Public and downloadable files

| File | Classification | Notes |
|---|---|---|
| `public/favicon.svg` | General Partner | Brand icon only |
| `public/opengraph.jpg` | General Partner | Public social preview image; no restricted commercial content |

There are no externally downloadable business plans, revenue models or commercial cases in this release.

## Commercial and proof boundary

- Commercial source is retained outside the public route/import graph; design-partnership enquiries use `/partner-room/next-step`.
- Commercial figures must retain their existing status labels such as Indicative, Assumption, Subject to proposal, and To be measured.
- The Proof Calculator is approved as an external illustrative tool because it labels inputs as synthetic, labels outputs as modelled and unmeasured, and provides a visible reset to demonstration defaults.
- No calculator output is a quote, forecast, measured result, guaranteed outcome, or approved commercial offer.

## Enforcement

Release verification must include:

1. External route and resource-manifest boundary check.
2. Internal link and route-import checks.
3. Production build followed by the bundle-boundary scan.
4. Proof-language, terminology, and asset checks.
5. Browser verification of the public story routes, gate, Brief Library, Proof Calculator reset, and removed commercial-route fallback.
