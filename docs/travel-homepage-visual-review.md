# Travel homepage visual review

## Scope

Executive-luxury public homepage with a photographic arrival hero, lighter team editorial section, Working Proof introduction, and Stage 3 future-state preview. Navy, teal, ivory and a restrained orange accent connect the design to JALDO. Homepage typography is excluded from legacy content clamps so its own responsive styles apply.

The existing routes, Partner Room gate, and proof-status language remain in use. Stage 3 is explicitly an intended multi-site operating layer dependent on workflow validation and approved integrations. It is not presented as a current production capability.

## Assets

- `public/brand/jaldo-logo-white.webp`: existing JALDO Main asset from `LPRTBX/RTBX-Main/artifacts/rtbx/public/brand/jaldo-logo-white.webp`.
- `public/images/travel/arrival-hero.webp`: AI-generated illustrative hotel arrival, blue-hour lighting, guest and concierge on the right with room for text on the left; converted to WebP.
- `public/images/travel/team-coordination.webp`: AI-generated illustrative hotel staff coordinating around a tablet; resized and converted to WebP.

The page labels the hospitality imagery as illustrative and AI-generated. The exact public asset paths are explicitly approved in the source and production asset checks.

## Review evidence

- TypeScript typecheck passed.
- All 326 tests across 12 files passed.
- Production build and source/bundle boundary checks passed.
- Browser checks at 1440, 768, 390 and 320 CSS pixels: all images loaded, no horizontal overflow, no page errors.
- Working Proof, Stage 3 and Operating Layer links reached their intended paths and showed the existing access gate. Entry was verified using a local-only review code.
- Framework and operator story links remained public and reached their intended paths.
- Screenshots: `screenshots/travel-home-1440.png` and `screenshots/travel-home-390.png`.

The existing Vite large-chunk advisory remains. This change does not restructure the application's bundles.

## Delivery state

Prepared on `feature/jaldo-travel-executive-homepage`, based on `ea0c4abc5091a5678167d71bd17895846abf5821`. Visual review approved for commit and branch push. Replit deployment remains a separate step.
