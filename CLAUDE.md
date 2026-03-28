# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HikeLah is a hiking trail discovery web app for Singapore. It is an Express + EJS application deployed on Vercel, with trail data stored in a PostgreSQL database hosted on Render.

- **Live URL:** https://hike-lah.vercel.app
- **GitHub:** https://github.com/ReubenChan96/HikeLah
- **Vercel project ID:** `prj_O4eG5ULoThSyo7Fck9golV1QwyDU` (team: `team_RgrIWjJuw9a5qcAyY43PZoTT`)
- **Deployment:** Push to `main` → Vercel auto-deploys

## Commands

```bash
npm start                  # Run locally on http://localhost:3000
npx prisma migrate dev     # Create and apply a new DB migration
npx prisma studio          # Open Prisma DB GUI in browser
npx prisma db push         # Push schema changes without creating a migration file
npx prisma db seed         # Run the seed script (if configured in package.json)
```

## Architecture

```
server.js          → Express entry point, all routes, Prisma client init
views/             → EJS templates rendered by Express
  partials/        → Reusable navbar, footer, search-card components
public/
  css/             → Custom styles (Bootstrap 5.3.3 loaded via CDN)
  js/script.js     → Client-side: Google Maps init, filter logic, GA4
  data/
    merged-NParks-tracks.geojson  → GeoJSON loaded by the map page
    trail-metadata.json           → Display-only fields (images, links, pills) keyed by trail name
prisma/
  schema.prisma    → Trail model, PostgreSQL on Render
  seed.js          → Seed script for populating trails + metadata
```

### Data Flow

- **Explore page:** `GET /explore` queries `prisma.trail.findMany()`, merges results with `trail-metadata.json` (image paths, guide URLs, formatted distance, extra pills), then renders `explore.ejs` with the merged `trails` array.
- **Map page:** `GET /map` renders `map.ejs` with the Google Maps API key. The GeoJSON file is fetched client-side by `script.js`.
- **Filter logic:** Entirely client-side in `script.js`. Trail cards have CSS classes like `region-north`, `type-park`, `trail-walk` that the filter checkboxes show/hide.

### Trail Model (Prisma)

The `Trail` model in `prisma/schema.prisma` uses boolean fields for region (`north`, `south`, `east`, `west`, `central`) and terrain attributes (`casualWalk`, `forestedTrail`, `floraFaunaSpotting`, `wildlifeSpotting`). Display-only data (image URLs, external guide links, formatted distance strings, extra pills like "Bike-friendly") lives in `public/data/trail-metadata.json`, keyed by trail `name`.

### CSS Class Generation

`server.js` derives CSS filter classes from DB boolean fields before passing to EJS:
- `region-{north|south|east|west|central}` from region booleans
- `type-{park|challenge|connector}` from `trailType` string
- `trail-forest` from `forestedTrail`, `trail-walk` from `casualWalk`
- `sight-ff` from `floraFaunaSpotting`, `sight-animal` from `wildlifeSpotting`

## Environment Variables

Required in `.env` (see `.env.example`):
- `DATABASE_URL` — PostgreSQL connection string (Render)
- `GOOGLE_MAPS_API_KEY` — passed to `map.ejs` at render time
- `ANTHROPIC_API_KEY` — reserved for future Claude integration

## Claude Integration (Planned)

A stub `POST /api/claude` route exists in `server.js` as an extension point. The integration use case is not yet scoped. When ready, add `@anthropic-ai/sdk` as a dependency and implement the route handler.
