# Core contract status, gaps and what this workspace reuses (review note)

Written for the proactive scenario in this workspace. Facts are from reading Core `main` (`d388f33`, which includes the merged PR #121 and Contract 1.3.0 draft work) and from tests in this folder. Nothing here is an acceptance.

## 1. What was reused from JALDO-Travel-Guest PR #9 (draft) and `docs/APP_LOOP_AUDIT.md`
Reused as **interaction lessons only**. No code, no local lifecycle engine, no fixtures were copied.
- A role-scoped “Recognised for you” experience: the person who must act sees what was recognised, why, the recommendation, who decides, and the next permitted action, without opening a reviewer-only page. (Here: the Duty lead's signal desk and attention panel.)
- Recommendation reasons and sources sit behind a disclosure; the screen leads with the person's next action.
- Guest screens never show recognition, sources, rules or recommendations; they show only what concerns the guest.
- Delivery is not resolution; unknown is not success; owner proposals publish nothing and score no one.
- “Recognised but not completable here” is stated honestly rather than faked.
Not reused: PR #9's local `loopCases`/`loopDecide`/`loopWork` lifecycle (the thing Core's kernel replaces), its fixtures, or its Owner role.

## 2. Core contract status (as recorded in Core; a merged contract is not an accepted contract)
| Contract | Status recorded in Core | Used here |
|---|---|---|
| `jaldo.event` envelope, event admission | In Core's kernel | Yes: validates every signal; Core admits the opening event |
| Kernel contract 1.2.0 | Merged to `main` (#120, #121). Its documents say “draft for review”; no owner acceptance is recorded | Yes, pinned at `79939dc`. A review demonstration, not an acceptance claim |
| Kernel contract 1.3.0 | **DRAFT**, “not reviewed, not accepted”; merged without a recorded owner review (#126, #128). Core `main` already reports 1.3.0 | **No.** The workspace stays on the pinned 1.2.0 |
| ADR-0036 | Accepted by the owner (recorded 2026-10-31) | Not exercised (no server/storage) |
| ADR-0037 (queued execution, multi-party) | Proposed, not accepted | Not relied on |
| ADR-0038 (federation), consent-withdrawal design | Proposed / design only | Not used; withdrawal is outside this demonstration |
| Advisory recommendation contract (`api-server/src/ai/recommendation.ts`) | Exists in code | Not invoked; no model is connected |

## 3. Precise gaps (each is asserted by a test in `tests/scenario.test.ts`)
| | Missing in Core | Boundary demonstrated |
|---|---|---|
| G1 | No accepted **pre-request signal store**: ordering, staleness, per-source freshness limits, business-field validation (required fields, allowed values, room matching, full timestamps) and cross-source correlation. Core's duplicate rule (idempotency key) exists only inside an opened coordination; its event envelope checks shape, scope, purpose, classification and permitted context only | The signal desk (Travel-side adapter) mirrors the duplicate/conflict rule and adds event-time ordering, freshness limits (re-evaluated whenever the clock moves and again at adoption), future-date rejection and the business checks. Labelled a demonstration |
| G2 | Core admits an opening event and capacity changes only. A maintenance work-order event cannot be recorded as a fact | Maintenance facts are held by the desk and shown with source and time. Core's refusal is displayed |
| G3 | A system actor can open a request only because this configuration's `prepare-plan` automation lets it prepare. There is no purpose-specific permission for “open from an integration”, and no accepted contract says whether a system may open a guest-related request unprompted | Core's configured system actor records the opening event, and only after the Duty lead adopts. Policy for Core's owners |
| G4 | Core derives recommendations for the request owner **after acceptance**. None exists for an addressed holder who has not accepted, or as a role-scoped queue | The pre-acceptance recommendation is the desk's, not Core's. After acceptance Core's plan, approvals and recognition drive everything |
| G5 | No Core command to adopt a recognised pre-request moment, and **no adoption evidence contract**: Core's record holds the opening event (id, sequence, idempotency key) but has no field for who decided, when, why, on which sources or under which rule version | The Duty lead's button triggers Core's system actor. A **demonstration decision record** (authorised by, when, reason, source references, rule version, evidence fingerprint) is kept by the adapter beside Core's opening event and labelled as not Core evidence. A test proves Core's evidence does not contain it |
| G6 | No Core record for process-review proposals or rule changes | Proposals are shown for authorised review and saved nowhere; no rule changes; no person scoring |
| G7 | Not connected: real PMS and maintenance systems, verified identity and grants, delivery channels, a recommendation model | Everything is fictional, in-page and simulated |
| G8 | No Core contract for the guest to **accept or decline an offer of help**, distinct from sharing approvals; no record of an offer; no deadline or no-response handling for an unanswered offer. Core's `responses` apply only to completed work | The guest's Yes / No thanks / no response is a demonstration record; a demonstration gate keeps only NEW sharing approval closed until the guest says yes. Refusing and taking back an approval are never gated (Core decides). Agreement to share never stands in for accepting help; Yes shares nothing. The guest may also say they don't want further help, including after disclosure (see G9) |
| G9 | No Core contract for **stopping released work, recalling shared information or withdrawing a permission after disclosure** (the consent-withdrawal design is a proposal only). `withdraw` and `revokeApproval` apply before release | Declining further help is recorded as the guest's request and nothing else: no Core evidence is added, nothing is cancelled, recalled or withdrawn, and released steps are listed for the Duty lead's manual review with whatever Core actions it does offer. Test: Core's state and evidence are identical before and after |

## 4. Derived configuration
`src/config.ts` takes Core's `travel-practical-support@1.0.0` and adds ONE opening event type (`proactive.checkin-offered`) with the same purpose, classification and permitted context as the guest's own opening event. Core's strict loader validates it; a test proves nothing else differs. It is review-only: Core's own configuration has no proactive opening event, and adding one belongs to Core's owners.

## 5. What is real and what is demonstrated
Real, from the pinned Core kernel: opening, acceptance, plan preparation, the guest's approvals, checks, handover, delivery, deadlines, responses, follow-up, linked work, and every refusal. Demonstrated: the fictional events, the signal desk's interpretation rule (`proactive-checkin-demo v0.1`, data in `src/signals.ts`), the recommendation text, the process-review summary. **No AI model is connected**; the recommendation is a fixed configured rule with fixed wording.

## 6. Exactly what is where
**Implemented in Core (the pinned 1.2.0 kernel, unmodified):** the `jaldo.event` envelope and opening-event admission; opening a request from a configured system actor; acceptance of responsibility; plan preparation; the guest's sharing approvals and their refusal; checks, handover, delivery, acceptance and completion as separate records; deadlines and their expiry; the guest's feedback after delivery and the owned follow-up; linked work and required dependencies; plan revisions and withdrawn approvals; every refusal reason shown; evidence with provenance and sequence.

**Belongs to the demonstration adapter (this folder, labelled as such):** the signal desk (event-time ordering, duplicate/conflict/stale handling, per-source maximum ages, future-date rejection, required-field, allowed-value, room-match and full-timestamp validation, freshness re-evaluation on every clock move and at adoption); the interpretation rule `proactive-checkin-demo v0.2` and the recommendation wording; the adoption decision record (who, when, reason, sources, rule version, evidence fingerprint) and the check that the evidence is what the person saw; the guest's Yes / No thanks / "I don't want further help" / no response about help (recorded as the guest's request only: it adds nothing to Core's evidence, stops no work, recalls nothing, withdraws no permission) and the gate in front of NEW sharing approval only; the process-review summary and its proposals; roles, wording and layout.

**Still needs a shared contract (Core owners to decide; nothing is claimed):** a pre-request signal contract (freshness, ordering, validation, correlation, source references); an adoption/authorisation evidence contract (actor, time, reason, sources, rule version) and a command for adopting a recognised moment; an offer-of-help contract (offer, accept, decline, decline further help, no response, deadline) separate from sharing approvals; stopping released work, recalling shared information and withdrawing permission after disclosure (G9); whether a system may open a guest-related request unprompted; a record for review proposals; recommendations before acceptance and role-scoped queues; real identity, grants, channels and sources.
