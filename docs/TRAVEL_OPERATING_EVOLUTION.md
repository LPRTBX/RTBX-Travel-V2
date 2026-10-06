# Travel operating evolution walkthrough

Open Partner Room → Reference Material → Operating Evolution, or follow the links from Architecture Lab, Operations Centre, Product Proof or Simulation Lab.

This is a working, session-only planning simulation. It extends the existing synthetic response-and-replay story with earlier readiness recognition. It does not replace the canonical runtime, authenticate a reviewer, dispatch tasks, persist policies or implement deployed machine learning.

## Walkthrough

1. Run two cycles with the default settings. Each has 100 synthetic arrivals, 20 room delays and 640 total staff minutes. The same fixture mix permits a controlled policy comparison.
2. Review the recurring pattern as the simulated Duty Manager. Rejecting requires a reason and retains the current policy. An identical evidence set cannot immediately repropose the rejected change; another measured cycle can support another review.
3. Approve policy v2 and run the next cycle. Room-not-ready and high housekeeping-load inputs trigger checks 45 minutes early. With capacity for 20 preparations, 30 alerts produce 20 tasks, including seven unnecessary tasks. Seven arrival delays remain. Total modelled staff time is 514 minutes, releasing 126 minutes against the paired reference.
4. Review the unnecessary preparations. Approve policy v3, which also requires a pre-arrival readiness forecast predicting a delay. With the default fixture and capacity, 20 relevant alerts produce 20 preparations, zero delays and 360 staff minutes. Modelled time released is 280 minutes per 100 arrivals.
5. Challenge the cycle: lower preparation capacity, remove the forecast or remove follow-up measurement. Capacity holds remain visible. Missing corroboration makes v3 fall back to arrival response. Missing measurement leaves outcome and benefit figures unconfirmed and excludes the cycle from learning evidence.
6. Inspect individual correlated arrival records and policy review history. Rollback changes subsequent cycles while retaining earlier evidence.

## Assumptions and impact

All arrivals consume two staff coordination minutes. Preparation adds eight minutes. A delayed arrival adds 22 recovery minutes and 30 guest waiting minutes. These are explicit illustrative assumptions, not industry benchmarks. Tasks are prioritised in fixture order under a fixed preparation capacity. The input forecast deliberately has perfect discrimination in this small example; this does not establish predictive accuracy.

Counterfactual delay prevention is knowable here only because the synthetic comparison supplies a paired arrival-response reference. In a real pilot, prevention needs an appropriate evaluation design; absence of a complaint is not proof that an intervention prevented one.

The view shows guest waiting, housekeeping tasks and holds, unnecessary preparations, remaining reception recovery, and total staff time. Time released is capacity rather than realised payroll savings. Labour cash realisation, avoided recovery spend and incremental contribution remain separate inputs in the value calculator; they are not automatically added to this walkthrough.

Before broader adoption, measure input freshness and prediction error, confirm named review and execution authority, capture task delivery and follow-up, compare normalised outcomes and total team workload, and test whether earlier readiness work displaces other service. Maintenance, welfare, partner activation and cross-property rollout require their own scenario evidence and review; this readiness fixture does not demonstrate those outcomes.
