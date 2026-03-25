# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the DriveSuraksha AI hackathon MVP — an AI-powered driver safety and civic intelligence platform for Indian urban roads.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Recharts + Framer Motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (in-memory for MVP)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server with DriveSuraksha routes
│   └── drive-suraksha/     # React + Vite frontend (main app, served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
└── ...config files
```

## DriveSuraksha AI Features

### Frontend Pages (artifacts/drive-suraksha/src/pages/)
- **Landing** (`/`) — Hero with CTA, feature cards, stats
- **DriverDemo** (`/demo`) — Live AI edge demo with detection toggles, camera sim, risk scoring
- **CivicScore** (`/score`) — Score dashboard with gauge, sub-scores, weekly trend
- **RouteRisk** (`/route`) — Route risk timeline with hazard zones
- **CityIntel** (`/city`) — City analytics dashboard with charts
- **DemoScenario** (`/scenario`) — Automated 6-step demo scenario runner

### Frontend Components
- `components/ui/score-dial.tsx` — Circular SVG score gauge
- `components/ui/risk-badge.tsx` — Animated LOW/MODERATE/HIGH risk badge
- `components/ui/stat-card.tsx` — Stats card with icon + trend
- `components/layout/AppLayout.tsx` — Sidebar nav + mobile menu
- `hooks/use-scoring-engine.ts` — Client-side rules-based scoring logic

### Backend API Routes (artifacts/api-server/src/routes/)
- `events.ts` — GET/POST driving events (seeded with 5 Indian metro events)
- `score.ts` — GET/POST civic score with weekly trend
- `route.ts` — GET route risk zones (Koramangala → MG Road → Indiranagar)
- `city.ts` — GET city intelligence insights (Bengaluru data)
- `demo.ts` — GET 6-step demo scenario steps

### Scoring Logic
- Start: 85
- Pothole/waterlogging: -15
- Lane violation: -10  
- Signal violation: -10
- Wrong-side: -8
- Helmet missing: -12
- Pedestrian risk: -7
- Honking spike: -5
- Smooth driving bonus: +3
- Risk: LOW ≥75, MODERATE 50-74, HIGH <50

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## Key Commands

- `pnpm --filter @workspace/drive-suraksha run dev` — start frontend dev server
- `pnpm --filter @workspace/api-server run dev` — start backend dev server
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types
