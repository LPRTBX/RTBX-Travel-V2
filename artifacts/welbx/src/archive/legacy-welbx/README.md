# Legacy WELBX Archive

**Archived:** 2026-07-19  
**Sprint:** RTBX Travel Partner Room V2 — Sprint 1 (Repository and Architecture Stabilisation)

---

## Why these files were archived

These files are page components from the original WELBX product codebase. They are not part of the active RTBX Travel Partner Room application and are not imported by any active route.

They were identified as orphaned (not referenced in `src/App.tsx`) during the Sprint 1 read-only repository audit. They contain legacy WELBX branding, BXOS/NEXUS internal component naming, and product concepts that belong to the original WELBX operating layer rather than the RTBX Travel vertical.

---

## Status

- **Not imported** into any active route
- **Not included** in the production build output
- **Not part of** the RTBX Travel Partner Room
- **Retained here** so Git history and recovery path remain available if any content is needed in a future sprint

---

## Rules

> **Do not import any file from this directory into active production routes.**  
> If content from these files is needed, extract only the required data or logic into a new Travel-specific component.

---

## Archived files

| File | Original purpose |
|------|-----------------|
| SystemState.tsx | WELBX system health dashboard |
| ExecutionTimeline.tsx | WELBX execution event timeline |
| CentralCommunicationsSystem.tsx | WELBX NEXUS comms layer |
| LearningLayer.tsx | WELBX learning feedback loop |
| CausalTrace.tsx | WELBX causal trace / BXOS engine view |
| ScenarioDemo.tsx | WELBX scenario demonstration |
| CommandMode.tsx | WELBX command interface |
| SignalIntelligence.tsx | WELBX signal intelligence view |
| StrategicVisibility.tsx | WELBX strategic dashboard |
| ValueProof.tsx | WELBX value proof view |
| OutcomeIntelligence.tsx | WELBX outcome intelligence |
| GHSOL.tsx | WELBX guest health/safety operating layer |
| CompareMode.tsx | WELBX vs traditional comparison |
| MomentIntelligence.tsx | WELBX BXOS moment intelligence |
| BehaviouralGenome.tsx | WELBX behavioural genome model |
| ExecutiveDashboard.tsx | WELBX executive dashboard |
| InterventionLibrary.tsx | WELBX intervention catalogue |
| LiveMoments.tsx | WELBX live moments view |
| ExecutionIndex.tsx | WELBX execution index |
| ConsistencyEngine.tsx | WELBX consistency engine view |
| EnvironmentHealthDetail.tsx | WELBX environment health detail |
| DecisionRegistry.tsx | WELBX decision registry |
| EnvironmentHealthIndex.tsx | WELBX environment health index |
| SignalRegistry.tsx | WELBX signal registry (legacy) |
| OutcomeRegistry.tsx | WELBX outcome registry (legacy) |
| MomentRegistry.tsx | WELBX moment registry (legacy) |
| CommunicationRegistry.tsx | WELBX comms registry (legacy) |
| CommandCentre.tsx | WELBX command centre |
| CommunicationIntelligence.tsx | WELBX comms intelligence |
| PlaybookEngine.tsx | WELBX playbook engine (legacy) |
| GuestLayer.tsx | WELBX guest layer view |
| PresentationMode.tsx | WELBX presentation mode |
| Presentation5Min.tsx | WELBX 5-minute pitch deck |
| Presentation15Min.tsx | WELBX 15-minute pitch deck |
| ScenarioScorecard.tsx | WELBX scenario scorecard |
| ScenarioStepRunner.tsx | WELBX scenario step runner |
| ShadowPilotMode.tsx | WELBX shadow pilot recording tool |
| ScenarioValidationDashboard.tsx | WELBX scenario validation dashboard |
| ScenarioReplayLab.tsx | WELBX scenario replay lab |
| ValidationSummary.tsx | WELBX validation summary |
| ExportReports.tsx | WELBX export reports |

---

## Recovery

All files remain in Git history. To recover a file:

```bash
git log --all --follow -- src/archive/legacy-welbx/<filename>
git show <commit>:artifacts/welbx/src/pages/<filename>
```
