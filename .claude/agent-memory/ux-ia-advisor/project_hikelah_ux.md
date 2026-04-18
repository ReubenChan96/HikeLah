---
name: HikeLah UX/IA context
description: Core UX patterns, IA decisions, component conventions, and recurring issues for the HikeLah hiking trail discovery app
type: project
---

HikeLah is a Singapore hiking trail discovery web app (Next.js 15, Tailwind, Supabase). Live at https://hike-lah.vercel.app.

**Why:** Solo developer project; all fixes must be practical for one person to implement.

**How to apply:** Always calibrate recommendation effort to solo dev context. Prefer targeted, low-risk changes over architectural rewrites.

## IA Schema
- Primary schema: **type-based** (trail types: Challenge Trail, Nature Park, Park Connector) + **region-based** as secondary facet filter
- Filter panel uses client-side useMemo filtering — no DB re-fetch on filter change
- Trail categorisation uses CSS class strings on TrailCardData.cardClasses (e.g. `region-north trail-forest`)

## Navigation
- 5-item desktop nav: Home, Explore, Interactive Map, Useful Links, About Me
- `aria-current="page"` is implemented on active links
- Mobile: hamburger toggle via useState; no focus trap; no focus restoration on close
- No skip-to-content link anywhere in the app

## Key Components and Issues Logged
- **Navbar.tsx**: Missing aria-expanded on hamburger button; no focus trap; no Escape key handler; no focus restoration
- **FilterPanel.tsx**: Filter dropdowns missing aria-expanded/aria-controls; no Escape key handler; no aria-live for AI results; AI input uses focus:outline-none (removes focus ring); AI input uses placeholder-only labelling (no visible label); empty state is plain text only
- **TrailCard.tsx**: Entire card is wrapped in a single Link (good), BUT sightings icons use hover-only tooltips (group-hover:block) — not keyboard or touch accessible; icon-only sightings with no visible text
- **trails/[id]/page.tsx**: Hero image rendered as CSS background-image div, not `<img>` — cannot have meaningful alt text; breadcrumb does not restore filter state; stat card icons are decorative Font Awesome but have no aria-hidden
- **map/page.tsx**: No non-map fallback content for keyboard/screen reader users; no legend for GeoJSON trail colours
- **useful-links/page.tsx**: External links open in new tab with no warning to user; link cards have no visible "opens in new tab" indicator
- **layout.tsx**: `lang="en"` is present (confirmed). Font Awesome loaded via CDN link tag.

## Accessibility Gaps (from 2026-03 audit)
- No skip-to-content link (WCAG 2.4.1)
- No focus trap on mobile menu (WCAG 2.1.2)
- AI search input: focus:outline-none removes focus ring (WCAG 2.4.7)
- No aria-live region for AI results or filter result count (WCAG 4.1.3)
- Hover-only sightings tooltips (WCAG 1.4.13)
- Hero background-image cannot be described by screen readers
- Font Awesome icons not aria-hidden throughout (WCAG 1.1.1)
- No prefers-reduced-motion handling (WCAG 2.3.3)
- Filter dropdown buttons missing aria-expanded (WCAG 4.1.2)
- External link new-tab behaviour not announced (WCAG 3.2.2)
