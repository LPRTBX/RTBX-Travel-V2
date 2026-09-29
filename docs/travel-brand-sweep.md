# Travel brand sweep

Base: `eb7ea1a`, the merged executive homepage. Review branch: `feature/jaldo-travel-brand-sweep`.

## Design decisions

| Area | What it needs | Photography decision |
| --- | --- | --- |
| Homepage | Approved executive hospitality arrival and team story | Keep existing images and layout |
| Story Hub | A clear choice of journeys; a human connection to the homepage | Reuse the existing team image once, with an illustrative-image caption |
| Executive walkthrough | Legible slides, shared branding and mobile stacking | Use its existing diagrams, metrics and interface illustrations |
| Interactive guest story | Usable timeline, narrative and simulated interface on phones | Keep the simulated interface; no decorative photo |
| Partner Room and access screen | Approved wordmark, consistent navigation, calmer hierarchy | No photograph needed |
| Working Proof, configuration, scenarios and communications | Clear controls, state labels, accountable decisions and readable evidence | No photographic backgrounds or image cards |
| Stage 3 and operating model | Readable future-state explanations and structural diagrams | Keep diagrams and role views |
| Resource library and partner briefs | Consistent document hierarchy, readable text and links | No repetitive header photos |

## Changes

- Replaced legacy decorative gold with mist/teal and aligned dark surfaces with the homepage navy across the active import graph. Existing inline hexadecimal colour values remain compatible with the alpha suffixes used by the diagrams and cards.
- Retained semantic red, amber and green states, plus distinct scenario/role colours. No workflow states, decision logic, route registrations or access rules were changed.
- Used the existing approved JALDO image wordmark in the Partner Room, access gate and story presentations.
- Added a homepage return link in the Partner Room footer.
- Applied Manrope headings, orange keyboard focus indicators and stronger supporting-text contrast.
- Widened Story Hub cards, with three columns on desktop, two on tablet and one on mobile.
- Stacked the guest story timeline, narrative and simulated interface on phones; added accessible names to its close and step controls.
- Improved executive slide padding and column stacking on small screens.

No new photography was generated. Inactive legacy pages and restricted commercial modules were excluded from the sweep. Existing email addresses and technical identifiers were preserved; changing contact addresses requires a verified replacement.

## Validation and review

TypeScript, all 326 tests and the production build passed. Source and bundle access-boundary checks passed. Browser review covered 58 desktop paths and eight representative mobile paths (66 route/viewport checks), with no page errors, missing images or remaining document overflow. The mobile Partner Room menu reached Working Proof; the guest story reached its eighth step with a full-width narrative panel. Screenshots were reviewed after entry animations completed.

See `travel-brand-browser-results.json` for route and responsive checks. Representative desktop and mobile previews are in `screenshots/brand-*.png`.

This is a visual and responsive update to the existing experience. It does not establish a new product-readiness claim or change Working Proof and future-state boundaries. LP approved the visual sweep for commit and branch publication. Merge and Replit deployment remain separate steps.
