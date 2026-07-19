# RTBX Travel — Access and Proof Boundaries

**Version:** Sprint 1  
**Date:** 2026-07-19

---

## 1. Current access mechanism

The RTBX Travel Partner Room uses a **client-side access code gate** (`PartnerAccessGate.tsx`).

- An access code is set via the `VITE_PARTNER_ROOM_CODE` environment variable at build time.
- On load, the application compares the user-entered code against the value stored in `sessionStorage`.
- If the environment variable is not set, the gate is bypassed and access is granted automatically.

**The gate is explicitly labelled in the UI as a front-end MVP access gate, not a security boundary.**

---

## 2. What it protects against

- Casual or accidental discovery by non-partners browsing to the URL.
- Sharing the link without the code making the content immediately visible.

---

## 3. What it does not protect against

- Anyone with the URL and access code (which may be shared in email, Slack, etc.).
- Server-side inspection — the application is a static front-end; all content is bundled into the JavaScript payload regardless of the gate state.
- Browser developer tools inspection.
- Any attacker who sets `sessionStorage.setItem("partner_room_access", "<code>")` directly.

**Do not treat this gate as a security or access-control boundary.**

---

## 4. Current data type used

All content is **synthetic demonstration data** unless explicitly labelled otherwise:

- Scenario signals, outcomes, and values are illustrative.
- Role assignments are representative, not from a live deployment.
- Financial figures (e.g. "£85 supplement", "£2,000 revenue gap") are demo scenario values, not RTBX product pricing.

---

## 5. Proof boundary definitions

Use these terms consistently across all content. Do not use a stronger term than the current state warrants.

| Term | Meaning | Current use |
|------|---------|-------------|
| **Working Proof** | A functioning interactive interface demonstrating the intended workflow | ✅ Applies to the Partner Room |
| **Simulation** | A workflow using synthetic signals, actions, communications, evidence or outcomes | ✅ Applies to all Live Scenarios and demos |
| **Connector-ready** | An interface contract, mapping and test harness exist | ⚠️ Only use when integration spec is complete |
| **Integrated** | Data has been successfully exchanged with a named external system | ❌ Not yet applicable |
| **Production** | Deployed with production authentication, monitoring, data controls and operational support | ❌ Not yet applicable |

---

## 6. Production authentication requirements

Future production deployment of the Partner Room or operator-facing tools requires:

- Server-side authentication (session token, JWT, or OIDC)
- Role-based access control (partner, operator, internal)
- Audit logging for access events
- Removal of the `VITE_PARTNER_ROOM_CODE` client-side gate
- Environment-specific content serving (no synthetic data in production)

---

## 7. Rules for confidential documents

- Commercial Partnership Brief, Revenue Model, and detailed pricing documents must be served via authenticated routes only.
- Resource library documents linked from the Partner Room are currently rendered as React pages behind the client-side gate — they carry the same limitations described in section 3.
- No document should claim "this is a secure environment" without server-side authentication being in place.

---

## 8. Rules for synthetic versus customer data

- All demonstration data must be clearly labelled **DEMO**, **SYNTHETIC DATA**, or **ILLUSTRATIVE** in the UI.
- Named brands or organisations may only appear in deliberately scoped, pre-approved pages (e.g. the IHG Pilot Story lab under `/story/*`).
- Scenario financial values are illustrative only and must not be represented as contracted or guaranteed outcomes.
- The Partner Room must never display real guest data, real property operational data, or real staff names.
