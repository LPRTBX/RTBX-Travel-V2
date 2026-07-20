# RTBX Travel Partner Room — Release Security Boundary

**Document type:** Release gate — security and privacy boundary definition  
**Owner:** RTBX  
**Version:** Sprint 5 / v2.0  
**Date:** July 2025  
**Status:** Approved for demonstration release

---

## Purpose

This document defines what the RTBX Travel Partner Room release protects, what it does not protect, what data it holds, how it persists data locally, and what production engineering would be required before this application could be deployed in a customer-facing or partner-credentialled environment.

---

## 1. What This Release Is

The RTBX Travel Partner Room is a **demonstration and pilot-evaluation application**. It is:

- A React single-page application (SPA) with no backend server
- Served as a static bundle from Replit's hosting infrastructure
- Entirely local-execution (no API calls to external systems)
- Populated entirely with synthetic demonstration data
- Not connected to any live RTBX production system, partner system, or customer environment

This release is intended for: face-to-face partner evaluation sessions, investor briefings, pilot alignment meetings, and controlled distribution to named partner contacts.

---

## 2. What This Release Protects

### 2.1 No Production Data
- Zero production customer records
- Zero live guest data
- Zero real booking, PMS, CRM or task management data
- Zero real staff identities or personal information
- All scenario data is fabricated (synthetic personas, fictional properties, illustrative outcomes)

### 2.2 No Backend Credentials
- No API keys in the client bundle
- No server-side secrets accessible to the browser
- No OAuth tokens or session secrets stored in client code
- The `SESSION_SECRET` environment variable is server-side only and not bundled

### 2.3 No Authentication Required (Demonstration Mode)
- The `PartnerAccessGate` component provides a lightweight client-side access gate
- This gate is **not** production authentication — it is a demonstration access layer
- It is not resistant to circumvention by a motivated user
- No user accounts, passwords or credentials are stored or transmitted

### 2.4 No External Network Calls
- The application makes no calls to external APIs during normal partner room operation
- The Proof Calculator, Build & Configure, and Execution Centre all run on local state
- No analytics, tracking, or telemetry is embedded

---

## 3. What This Release Does NOT Protect

| Risk | Current Status | Production Engineering Required |
|---|---|---|
| Authentication / access control | Client-side gate only | Server-side authentication (Clerk, Replit Auth, or equivalent) |
| Partner data isolation | Not implemented | Per-partner data scoping and session management |
| Audit logging | Not implemented | Server-side audit trail |
| Rate limiting | Not implemented | API gateway or server middleware |
| Content delivery restriction | Static bundle accessible to anyone with the URL | Signed URL distribution or authenticated CDN |
| Data residency | Replit hosting (region varies) | Defined data residency per customer agreement |
| SOC 2 / ISO 27001 compliance | Not applicable in demo | Production security controls required |
| Penetration testing | Not performed | Required before customer production deployment |

---

## 4. Data Types Present in the Application

### 4.1 Synthetic Demonstration Data (present — not real)

| Data type | Location | Nature |
|---|---|---|
| Guest personas | `travelScenarios.ts`, `travelDeploymentConfig.ts` | Fictional, no PII |
| Property names | `travelDeploymentConfig.ts` | Fictional hotel/resort names |
| Staff role names | `travelRoles.ts` | Generic role titles, no real names |
| Commercial figures | `travelCommercialModel.ts` | Indicative ranges, clearly labelled |
| Scenario outcomes | `travelScenarios.ts` | Illustrative, not from real pilots |
| Integration descriptions | `travelDeploymentPathway.ts` | Architectural descriptions, no live credentials |

### 4.2 Local Persistence (localStorage)

| Key | Contents | Sensitivity |
|---|---|---|
| `rtbx-partner-access` | Boolean access gate flag | None — no credentials stored |
| `rtbx-deployment-config` | User's configured deployment (synthetic) | None — fabricated data only |
| `rtbx-execution-state-*` | Scenario execution trace (session) | None — synthetic demo data |

No personally identifiable information, credentials, API keys, financial data, or customer data is stored in localStorage under any circumstances.

### 4.3 Data Transmitted to External Services

None. The Partner Room does not transmit any data to external services during normal operation.

---

## 5. Bundle Composition Security

### 5.1 Third-Party Dependencies
- All dependencies are declared in `package.json` and managed via pnpm
- No CDN imports (all dependencies bundled)
- No unaudited scripts injected at runtime

### 5.2 Source Code Integrity
- TypeScript typecheck: ✅ zero errors
- No `eval()` or `Function()` constructor usage
- No inline `<script>` injection
- No `dangerouslySetInnerHTML` with user-provided content

### 5.3 Secrets Audit (Sprint 5)
Automated search for secrets patterns (`password`, `api_key`, `token`, `credential`, `private_key`) across all source files returned:
- 0 API keys
- 0 passwords
- 0 production tokens
- 0 private keys
- 0 OAuth secrets

Only semantic references found: "customer data", "approval" patterns — no actual secret values.

---

## 6. Network and Hosting Boundary

| Component | Current | Production Requirement |
|---|---|---|
| Hosting | Replit (dev domain) | Dedicated domain with SSL |
| CDN | Replit proxy | CloudFront or equivalent |
| DNS | `*.replit.dev` / `*.replit.app` | Custom domain |
| HTTPS | Provided by Replit | Enforced at all tiers |
| CORS | Not applicable (SPA) | API server CORS policy if backend added |
| CSP | Not configured | Content Security Policy header required for production |
| HSTS | Not configured | Required for production |

---

## 7. Production Engineering Required Before Customer Deployment

The following items are explicitly **out of scope for this demonstration release** and would be required before any customer production deployment:

1. **Authentication** — Implement server-side authentication (Clerk or Replit Auth) with role-based access control for partners
2. **Backend API** — Migrate from localStorage-only to a server-backed API with proper session management
3. **Data isolation** — Per-partner data scoping, no cross-partner data leakage
4. **Audit logging** — All partner access and interaction events logged server-side
5. **Penetration testing** — External security assessment before live partner access
6. **Privacy compliance** — GDPR/Privacy Act compliance review before collecting any partner data
7. **Access revocation** — Ability to immediately revoke partner access
8. **Dependency audit** — Full dependency audit via `pnpm audit` with all critical/high vulnerabilities resolved
9. **CSP headers** — Content Security Policy configured for production environment
10. **HTTPS enforcement** — HSTS + certificate pinning for partner-facing endpoints

---

## 8. Security Classification

| Aspect | Classification |
|---|---|
| Overall data sensitivity | **Non-sensitive** — all synthetic |
| Distribution scope | **Controlled** — named partner contacts |
| Code visibility | **Internal** — not public |
| Authentication requirement | **Advisory** — client-side gate only |
| Production readiness | **Not production-ready** — demonstration only |
