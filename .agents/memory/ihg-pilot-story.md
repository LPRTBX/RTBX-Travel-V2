---
name: IHG Pilot Story structure
description: Routes, files, and design decisions for the IHG Pilot Story narrative section
---

# IHG Pilot Story

## Routes
- `/story` → `StoryHub.tsx` — hub with 3 mode cards
- `/story/executive-briefing` → `Presentation5Min.tsx` (route alias, reuses existing 6-slide deck)
- `/story/operator-deep-dive` → `StoryOperator.tsx` — 13-slide standalone presentation
- `/story/live-guest-story` → `StoryGuestStory.tsx` — immersive 8-step walkthrough

## Sidebar
Section label: "IHG PILOT" — rendered between SECTIONS loop and HERO section in `Sidebar.tsx`.
Array is `IHG_ITEMS` (4 items). Label turns amber when `location.startsWith("/story")`.

## Sidebar/AppShell suppression
`AppShell` in `App.tsx` suppresses Sidebar and GlobalSearch for both `/presentation-mode/*` and `/story/*` routes (full-viewport experience). Check line with `isPresentation`.

## PresentationComponents.tsx
`SlideNav` now accepts `showExport?: boolean` (default true) — set to false in StoryOperator and any story slide that shouldn't show PDF export.

## StoryGuestStory design
- Left rail (220px): 8-step timeline with progress dots
- View toggle: GUEST / OPERATING / INFRASTRUCTURE — changes accent color (blue/amber/violet) and narrative content
- Keyboard: ← → for steps, 1/2/3 for view toggle, Esc to exit
- Bottom nav: pill dots + Previous/Next

## StoryOperator slides
13 slides: The Problem → GHSOL → Signal Registry → Moment Registry → Strategic Visibility → Decision Registry → Execution Index → Communications → Guest Layer → **Outcome Layer** → **Value Layer** (new, separate from Outcome) → Executive Command → Future Vision

**Why:** The operator briefing explicitly has Value Layer as its own distinct section (Protected Value / Created Value / Opportunity Visibility) — this is the key differentiator from the 12-slide Presentation15Min.
