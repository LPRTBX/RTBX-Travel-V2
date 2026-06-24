---
name: RTBX brand hierarchy
description: Brand architecture for the Partner Room app — which name to use for what layer
---

## Architecture

- **RTBX Group** — parent ecosystem (dim/white when shown)
- **RTBX Core** — infrastructure / signal-to-action engine (gold)
- **RTBX Travel** — travel and hospitality vertical (gold)
- **WELBX** — guest-facing human experience layer inside RTBX Travel (blue #3b82f6)

## Rules

- The app/site is called **RTBX Travel Partner Room** (not WELBX Partner Room)
- Broad vertical references → **RTBX Travel**
- Infrastructure/platform/operating chain/operator/dashboard references → **RTBX Core**
- Keep **WELBX** only for: guest check-ins, guest support, in-stay nudges, wellbeing prompts, concierge-style support, human experience layer, guest-facing demos
- WELBX always rendered in blue (#3b82f6), not gold

**Why:** User explicitly requested this rebrand so the app no longer feels like WELBX is the parent brand — RTBX Travel is the vertical, RTBX Core is the engine, WELBX is inside it.

## Standard brand line to include on landing/overview pages
"RTBX Travel is powered by RTBX Core. WELBX is the guest-facing experience layer."

## Second line for pages explaining the guest experience
"WELBX is the human layer guests interact with. RTBX Core is the infrastructure layer that classifies signals, guides action, escalates risk and creates the assurance trail."

## Files changed in this rebrand
PartnerRoomLayout.tsx, PartnerAccessGate.tsx, PartnerRoomLanding.tsx, PartnerOverview.tsx, PartnerOperatorBrief.tsx, PartnerCommercialModel.tsx, PartnerDemoPaths.tsx, PartnerCTAFooter.tsx
