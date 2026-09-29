# Travel simulation verification

Base: `50e1a76dff131ced5a5936a04c40f0c352ac36a9`.
Branch: `feat/continuous-travel-simulation` (review branch).

- Regression reproduced before fix: 100 executions at one fixed timestamp produced one unique execution ID. Test failed as expected.
- After UUID fix: all 8 simulation checks passed, including 1,000 repetitions for each of six configured scenarios (6,000 completed pathways), plus 100 burst-created executions.
- Full suite: 13 test files, 334 tests passed.
- Application TypeScript check and separate simulation TypeScript check: passed.
- Vite production build: passed, with existing large-chunk and tooltip sourcemap warnings.
- Access-boundary check: 60 approved routes and 84 active source modules passed.
- Built-bundle boundary check: 33 files scanned, passed.
- Workflow YAML parsed; push, pull request, schedule and manual triggers validated. Workflow not executed remotely.
- No dependencies or lockfile changes.

Local environment has pnpm 11 rather than repository-pinned pnpm 10.26.1. Dependencies downloaded, but pnpm 11 reported an unapproved esbuild lifecycle script and generated a workspace setting. That generated setting was reverted without relaxing build-script approval. Verification used installed executable binaries directly. GitHub workflow uses the pinned pnpm version; its install step still needs confirmation from the first remote run.

Reports from the 1,000-repetition run are in `artifacts/welbx/simulation-results/` locally. They contain synthetic-engine results only. No backend/vendor calls, live notifications, production mutations, measured business outcomes or concurrent-user claims are included.

Activation requires review/merge to main. Other vertical adapters and a central results dashboard are not implemented by this first Travel change.
