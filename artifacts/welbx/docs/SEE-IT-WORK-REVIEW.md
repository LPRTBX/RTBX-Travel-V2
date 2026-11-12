# Travel “See it work” integration review

Prepared 13 November 2026. Base: `836ae09356a8797aa14090dd46640bb559b848a9` (main).

## Partner experience

- Homepage navigation, header action, hero secondary action and guest-sample response link lead to `/see-it-work`.
- The presentation-only public entry links to the existing isolated `/public-wellbeing?scenario=practical` and `?scenario=unsafe` demonstrations and the existing `/public-demo#sample-demo` room demo. No duplicate coordination engine or guest-app link is introduced.
- Public role previews and the changed-plan sequence are explicitly narrated design examples, not live app projections or a claim of exact parity with the interactive demos.
- The existing public wellbeing navigation includes a return to the consolidated entry.
- `/partner-room/application-review` retains the saved application workspace with an explicit reference-baseline qualification. Repository findings inside it were not refreshed. It contains Core compatibility, permissions, acceptance and release material and remains behind the existing session gate.
- The existing protected response workspace links to the application review and public walkthrough. Its integrity-checked bundle is unchanged.

## Access and implementation boundaries

Only `/see-it-work` and its trailing-slash alias are new anonymous endpoints. No directory, SPA fallback, technical file, external guest application or Core endpoint is exposed. The application review runs after the existing closed-by-default gate, uses the existing session and expires/revokes with it. Browser revalidation checks `/partner-session` on entry, interval, pageshow and visibility restoration. Scripts and styles use the existing hashed CSP; no inline-handler or unsafe-inline exception was added. Review-file inline styles were converted to stylesheet rules for that CSP.

All people and operational records in the presentation are fictional. No messages, bookings, payments, guest identity, staff authority or runtime Core integration are activated. Actual role projections require server-side implementation. No production publication is part of this change.

## Validation

- `node --test artifacts/welbx/server/access.test.mjs artifacts/welbx/server/public-wellbeing.test.mjs artifacts/welbx/server/response-workspace.test.mjs artifacts/welbx/server/see-it-work.test.mjs`: 15/15 passed, zero skipped.
- `node artifacts/welbx/scripts/check-access-boundaries.mjs`: passed; 63 approved SPA routes and 141 active modules. No SPA route change.
- Browser QA of an isolated static preview: homepage entry navigates to the new public page; role disclosure opens; desktop layout inspected.
- The static preview did not serve the built interactive wellbeing application or gated server endpoints. Those journeys were not rerun end-to-end in browser. Phone-width visual QA and a full workspace build remain outstanding. Dependency inputs and lockfile are unchanged.

## Before merging or publishing

Run the standard build and existing browser suites in the complete installed workspace. Check 320px/390px/desktop navigation, the existing practical/unsafe demo entry selections and return links, actual Partner Room login/refresh/expiry, and no protected content in anonymous responses. Confirm design and public wording. Keep this PR draft until those checks are reviewed. Merge and publication are separate actions.
