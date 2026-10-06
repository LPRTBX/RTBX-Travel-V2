# Travel operating value model

The Value Calculator models everyday coordination, opportunities, prevention, recovery and welfare. Issues are one primary category of operational moment, rather than the entry point for all value.

## Connected volumes

- Total rooms = sites × average rooms per site.
- Occupied room nights = total rooms × days in month × occupancy.
- Estimated room stays = occupied room nights ÷ average length of stay.
- Estimated guest arrivals = room stays × guests per occupied room.
- Estimated guest nights = occupied room nights × guests per occupied room.
- Interactions per room stay = guests per occupied room × average length of stay × interactions per guest per night.
- Estimated monthly guest interactions = guest nights × interactions per guest per night. At fixed occupancy, longer stays reduce arrivals but do not increase total guest nights.
- Category moments = room stays × moments per 100 room stays ÷ 100.
- Successful actions = category moments × assumed outcome rate.

Volumes are steady-state estimates, not reservation counts or distinct-person counts. A guest spanning several nights is not counted again each night. Staff and system signals can create moments independently of guest interactions; interaction volume does not automatically generate revenue. Each event should have one primary category. Several distinct moments can occur during a stay.

## Outcomes and value

Routine coordination shows potential staff capacity, not financial savings. Opportunities use net contribution per successful opportunity rather than gross revenue. Prevention and recovery use avoided cost per successful action. Each financial category has editable low/base/high values. If a tier crosses another, adjacent values move to preserve an ordered range. These tiers vary per-action value only, not probability or volume.

Gross category benefit = successful actions × value tier. Combined gross benefit is multiplied by the entered incremental share attributable to JALDO, then by (1 − overlap allowance). Entered monthly programme cost is subtracted afterward. Negative net estimates remain visible. A zero cost means costs have not been included. The overlap deduction is a planning assumption; it does not prove real event deduplication or eliminate double counting in the underlying evidence.

Staff time is kept outside the monetary sum. The model estimates time released, which must be checked against available capacity and actual baseline effort. Welfare and safety have no dollar or time-saving target. Their volume and action-rate hypotheses do not establish safety; pilots must separately validate response time, ownership, authorisation and follow-through.

## Example assumptions

Defaults are synthetic examples, not industry benchmarks. At 1 site, 120 rooms, 30 days, 75% occupancy, 3-night stays and 1.5 guests per occupied room, the model estimates 2,700 occupied room nights, 900 room stays and 1,350 guest arrivals. At two illustrative interactions per guest per night, this is 4,050 guest nights and 8,100 guest interactions, averaging nine per room stay. This rate is an editable example, not an industry benchmark. Arrival/departure exchanges should not be counted twice, and shared exchanges must not automatically be multiplied by every guest. Category defaults generate 3,240 operational moments. Financial benefit is shown separately from staff capacity and welfare activity.

All controls are editable, with visible sliders and numeric fields. Assumptions remain in the browser component for this visit; nothing is promoted to a deployment or drawn from live hotel data.

## Verification

681 Vitest tests across 26 files passed, including 11 operating-model checks for occupancy propagation, portfolio scaling, stay counting, interactions, non-financial welfare/capacity, attribution and overlap deductions, zero activity, negative net estimates and invalid assumptions. Application TypeScript, production build, internal links, routes, access and bundle boundaries passed. GitHub QA verifies the published branch. Rendered verification of the new page requires Replit to pull main and restart.
