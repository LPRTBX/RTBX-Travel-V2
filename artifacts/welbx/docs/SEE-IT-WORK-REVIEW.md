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

## Combined main reconciliation

The owner subsequently authorised combining this reviewed work with local main and merging only after the combined version passes its required checks. Publication remains a separate owner action.

- Local main at `bda64f9dbcb3844aef05b0fa3464a87887346878`, including all three local-only commits, is preserved on GitHub as `backup/travel-local-main-bda64f9-before-see-it-work`.
- The independently verified PR head `2bbdf00bba95392b60c6c3357033331c87473a96` is preserved on GitHub as `backup/travel-pr56-verified-2bbdf00`.
- Reconciliation started from current remote main. Both histories are retained as merge ancestors, not replaced or squashed away.
- Three conflicts were resolved deliberately: homepage, public-navigation tests and wellbeing return navigation. The consolidated public page, five-stage scripted room replay, optional detailed interactive review and contact changes from local main are retained. The approved See it work entry, public role disclosures and gated application review from PR 56 are retained.
- Navigation uses `See it work` and `Guest experience samples`, with the existing compact-header breakpoint and standalone-app isolation. The wellbeing page retains both See it work and Hotel room replay returns.
- Both sets of acceptance assertions are retained: consolidated section order and progressive disclosures, guided-replay states and reset, new entry/role/scenario links, full room-response decisions/evidence and isolated protected-review lifecycle.
- No access control, credential, deployment setting, live service or Core contract was changed by reconciliation. The response workspace and private documents retain their existing gate.

## Prior PR-only validation record

- Full production build and TypeScript check passed. The existing tooltip sourcemap and large-bundle warnings are non-blocking.
- Unit suite: 41 files, 868 tests passed. Server/access suite: 15 tests passed, zero skipped.
- Access boundaries passed: 63 approved SPA routes, 141 active modules and 44 built files scanned. Route imports and 115 internal links passed.
- The existing browser regression now checks the approved exact `See it work` navigation, header action and guest-sample destination instead of their replaced entry points. It still exercises the hotel-pressure explanation, direct room-demo fragments and both complete room-response decision paths; no coverage was removed.
- Public/partner browser acceptance passed at 320, 390, 820 and 1440px, including keyboard menus/focus, all four role disclosures, practical/unsafe scenario links, public returns, room-demo entry/return, guest-app isolation, direct protected assets/documents, old bookmarks and logout.
- The protected application review passed anonymous denial, form entry, refresh, expiry, re-entry and logout against an isolated server using a generated in-memory test credential and test clock. No real code, secret setting or production session was read or changed. Refresh asserts the document and session-check responses explicitly rather than relying on page-wide network idleness.
- Existing practical-support public/protected and safeguarding browser suites passed at 390, 820 and 1440px, including consent, role filtering, changed plans, missing checks and truthful unresolved states. The UI regression suite passed all 74 checks across its built-in viewports.
- A separate browser pass against the actual managed preview confirmed the public journey, scenario returns, role disclosure keyboard focus, static guest-screen boundary and technical-review gate at 320 and 390px. No horizontal overflow or application failure was observed.
- Dependency inputs, lockfile, runtime application code and access controls are unchanged by the release-verification fix. The pre-existing optional CI lint step has no configured script; this is not presented as a completed lint check.

## Combined release gate

The prior PR-only results above do not substitute for combined-version verification. Require the full build, browser/access checks and GitHub checks on the final combined review head to pass before merging. Keep the two named preservation branches and all three original local-main commits reachable.

After those checks pass, the owner has authorised the Travel-only merge and synchronisation of GitHub and Replit main. Do not publish or change deployment settings. Leave the tested app running for the owner's final Publish action. A production smoke test after an authorised deployment remains separate; isolated access tests and a working development preview do not establish deployed-build parity.
