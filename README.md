# RTBX Travel Partner Room

Private partner-facing environment for the **RTBX Travel** vertical.

The Partner Room is designed for strategic partners, operators, funders and deployment partners to understand the RTBX Travel operating model, product proof, deployment environments, commercial pathway and live MVP preview.

---

## What this is

RTBX Travel is the travel and hospitality deployment vertical powered by **RTBX Core**.

It shows how captured guest, staff, operator and approved system signals can become:

```text
Signal
→ Classified moment
→ Guided action
→ Communication routing
→ Assurance record
→ Value proof
→ Pilot evidence
```

WELBX is the guest-facing experience layer within RTBX Travel — not a separate platform or infrastructure layer.

---

## Structure

- **Partner Room** — landing overview of the RTBX Travel model
- **Deployments** — live deployment environments and demo links
- **Product Proof** — evidence of the signal-to-action pipeline in practice
- **Validation** — pilot and validation evidence
- **Commercial** — commercial pathway and partnership terms
- **Brief Library** — supporting reference documents and briefs

---

## Development

This app lives in the pnpm workspace monorepo at `artifacts/welbx`.

```bash
pnpm --filter @workspace/welbx run dev
pnpm --filter @workspace/welbx run typecheck
pnpm --filter @workspace/welbx run test
pnpm --filter @workspace/welbx run build
```

The Vite build config (`vite.config.ts`) falls back to `PORT=5000` and `BASE_PATH=/` when those environment variables are not set, so builds succeed locally, in CI, and in GitHub Actions without extra configuration.
