# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HikeLah is a hiking trail discovery web app for Singapore. Built with Next.js 15 (App Router) + TypeScript + Tailwind CSS, deployed on Vercel, with trail data stored in a PostgreSQL database via Supabase.

- **Live URL:** https://hike-lah.vercel.app
- **GitHub:** https://github.com/ReubenChan96/HikeLah
- **Vercel project ID:** `prj_O4eG5ULoThSyo7Fck9golV1QwyDU` (team: `team_RgrIWjJuw9a5qcAyY43PZoTT`)
- **Deployment:** Push to `main` → Vercel auto-deploys

## Commands

```bash
npm run dev                # Run dev server on http://localhost:3000
npm run build              # Production build (runs type-check)
npm start                  # Serve production build locally
npx prisma migrate dev     # Create and apply a new DB migration
npx prisma studio          # Open Prisma DB GUI in browser
npx prisma db push         # Push schema changes without creating a migration file
```

## Architecture

```
app/                        → Next.js App Router pages (server components by default)
  layout.tsx                → Root layout: Navbar, Footer, GA4, Google Fonts
  page.tsx                  → Home page
  explore/page.tsx          → Fetches trails from Prisma, passes to FilterPanel
  trails/[id]/page.tsx      → Trail detail: hero, stats, map, weather widget
  map/page.tsx              → Passes GOOGLE_MAPS_API_KEY to InteractiveMap
  about-me/page.tsx
  useful-links/page.tsx
  api/
    trails/route.ts         → GET /api/trails → prisma.trail.findMany()
    claude/route.ts         → POST /api/claude (501 stub, ready for Phase 3)
components/                 → React components ('use client' where interactivity needed)
  Navbar.tsx                → Mobile toggle via useState
  Footer.tsx                → Dynamic year
  FilterPanel.tsx           → Client: filter state, useMemo filtered trail list
  TrailCard.tsx             → Trail card with image, pills, sightings tooltips
  InteractiveMap.tsx        → Google Maps full map with GeoJSON trails overlay
  TrailMap.tsx              → Google Maps mini-map for trail detail page
  WeatherWidget.tsx         → data.gov.sg nowcast + 24hr forecast, haversine nearest area
lib/
  prisma.ts                 → Singleton PrismaClient (globalForPrisma pattern)
  buildTrailData.ts         → Derives CSS filter classes and pill labels from DB fields
  trailMetadata.ts          → Typed import of trail-metadata.json
types/
  trail.ts                  → Trail, TrailMeta, TrailSighting, TrailCardData interfaces
public/
  data/
    merged-NParks-tracks.geojson  → GeoJSON loaded client-side by InteractiveMap
    trail-metadata.json           → Display-only fields (images, links, pills) keyed by trail name
prisma/
  schema.prisma             → Trail model
  seed.js                   → Seed script
```

### Data Flow

- **Explore page:** `app/explore/page.tsx` (server component) calls `prisma.trail.findMany()`, merges with `trail-metadata.json` via `buildCardData()`, passes `TrailCardData[]` to `<FilterPanel>`. All filtering is client-side in FilterPanel — no DB re-fetch on filter change.
- **Trail detail:** `app/trails/[id]/page.tsx` fetches one trail by ID, merges metadata, passes `GOOGLE_MAPS_API_KEY` down to `<TrailMap>`. `<WeatherWidget>` fetches data.gov.sg client-side.
- **Map page:** Server component passes `apiKey` to `<InteractiveMap>`. GeoJSON fetched client-side from `/data/merged-NParks-tracks.geojson`.

### Trail Model (Prisma)

Boolean fields for region (`north`, `south`, `east`, `west`, `central`) and terrain (`casualWalk`, `forestedTrail`, `floraFaunaSpotting`, `wildlifeSpotting`). `buildTrailData.ts` derives CSS filter classes from these. Display-only data (images, guide URLs, pills) lives in `trail-metadata.json`, keyed by trail `name`.

### Google Maps Loading

Both `InteractiveMap` and `TrailMap` use a module-level singleton (`gmapsState`, `pendingInits`, `GMAPS_CALLBACK`) to prevent double-loading Google Maps across React Strict Mode's double-invoke of `useEffect`. Never use `next/script` inside client components for Google Maps — it causes hydration issues.

### CSP

`next.config.ts` `headers()` sets Content Security Policy. `'unsafe-eval'` is added to `script-src` in development only (required for Next.js webpack HMR). Modifying allowed domains requires editing `next.config.ts`.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string (Supabase)
- `GOOGLE_MAPS_API_KEY` — used server-side in `app/map/page.tsx` and `app/trails/[id]/page.tsx`
- `ANTHROPIC_API_KEY` — for Phase 3 Claude AI integration

## Tailwind Brand Colours

Defined in `tailwind.config.ts`:
- `brand-dark: #3D550C`, `brand-mid: #4A7212`, `brand-light: #6BA51A`
- `brand-pale: #f0f7e6`, `brand-bg: #FFF9EC`
