# DriveSuraksha AI 🛡️

> **AI-powered driver safety and civic intelligence for Indian urban roads.**
> Real-time hazard detection, civic scoring, and city-level road intelligence — built as a hackathon MVP.

---

## What It Does

DriveSuraksha AI turns a dashcam feed into a complete driver safety system:

- **Detects road hazards in real time** — potholes, waterlogging, lane violations, wrong-side driving, honking spikes, pedestrian risk — using OpenCV.js running entirely in the browser (no API calls, ~200ms per frame)
- **Calculates a Civic Driving Score** live as events are detected, with risk levels LOW / MODERATE / HIGH
- **Gives proximity alerts** — distance-based HUD overlay with escalating urgency (Neutral → CAUTION → BRAKE NOW) and step-by-step driver guidance cards
- **Pre-trip Route Risk Intelligence** — interactive dark map of Mumbai with 67+ plotted pothole clusters, a dashed route line, and a pulsing driver pin
- **City Intelligence Dashboard** — aggregated analytics for city operators: violation heatmaps, priority hotspots, incident counts across Mumbai's highest-risk intersections

---

## Screenshots

| Screen | Description |
|---|---|
| Driver Demo | Live dashcam feed with CV bounding boxes, HUD overlay, and real-time score |
| Route Risk | Dark Leaflet map — pothole clusters, route line, driver pin |
| Civic Score | Circular score dial, sub-scores, weekly trend chart |
| City Intel | Bar charts, priority hotspot list, city-wide analytics |

---

## Tech Stack

### Frontend (`artifacts/drive-suraksha`)
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | Wouter |
| Animation | Framer Motion |
| Charts | Recharts |
| Maps | Leaflet + React-Leaflet (CartoDB Dark Matter tiles) |
| CV Detection | OpenCV.js 4.8 (WASM, runs in browser) |
| State | React hooks + custom scoring engine |

### Backend (`artifacts/api-server`)
| Layer | Technology |
|---|---|
| Runtime | Node.js 24 |
| Framework | Express 5 |
| Logging | Pino + pino-http |
| AI (optional) | OpenAI GPT-4o Vision (fallback detection) |
| Build | esbuild |
| Validation | Zod |

### Monorepo
- **Package manager:** pnpm workspaces
- **TypeScript:** 5.9 with composite project references across all packages

---

## Project Structure

```
drivesuraksha-ai/
├── artifacts/
│   ├── drive-suraksha/          # React + Vite frontend
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── Landing.tsx         # Hero + feature cards
│   │       │   ├── DriverDemo.tsx      # Live AI demo + scoring
│   │       │   ├── CivicScore.tsx      # Score dashboard
│   │       │   ├── RouteRisk.tsx       # Route risk map
│   │       │   ├── CityIntel.tsx       # City analytics
│   │       │   └── DemoScenario.tsx    # Automated demo runner
│   │       ├── hooks/
│   │       │   ├── use-opencv-detection.ts   # CV pipeline hook
│   │       │   └── use-scoring-engine.ts     # Rules-based scorer
│   │       └── components/ui/
│   │           ├── pothole-map.tsx     # Leaflet map component
│   │           ├── score-dial.tsx      # SVG circular gauge
│   │           └── risk-badge.tsx      # Animated risk badge
│   └── api-server/              # Express API
│       └── src/routes/
│           ├── events.ts         # Driving events
│           ├── score.ts          # Civic score + weekly trend
│           ├── route.ts          # Route risk zones (Mumbai)
│           ├── city.ts           # City intelligence data
│           ├── demo.ts           # 6-step demo scenario
│           └── detect.ts         # GPT-4o Vision endpoint (optional)
├── lib/
│   ├── api-spec/                # OpenAPI spec + Orval codegen
│   ├── api-client-react/        # Generated React Query hooks
│   ├── api-zod/                 # Generated Zod schemas
│   └── db/                      # Drizzle ORM schema
└── artifacts/mockup-sandbox/    # UI prototyping sandbox (canvas)
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Install dependencies
```bash
pnpm install
```

### Run the API server
```bash
pnpm --filter @workspace/api-server run dev
# Starts on port 8080
```

### Run the frontend
```bash
pnpm --filter @workspace/drive-suraksha run dev
# Starts on port 5173 (or next available)
```

### Build everything
```bash
pnpm run build
```

---

## How the CV Detection Works

OpenCV.js loads once from CDN (~8MB WASM, cached after first load). Every **200ms**, the hook:

1. Draws the current video frame to a hidden `<canvas>` at 640×360
2. Crops to the lower 62% of the frame (road area — ignores sky and dashboard)
3. Converts to grayscale → Gaussian blur (5×5) to reduce noise
4. Applies adaptive mean threshold (block 25, C=8) to isolate dark regions
5. Morphological close (7×7 ellipse kernel) to fill internal gaps
6. Finds external contours and filters by:
   - Area: 350–22,000 px
   - Circularity: > 0.10 (roughly round)
   - Aspect ratio: 0.2–5.0 (not a thin line)
   - Mean brightness ≤ 140 (actually dark)
7. Scores candidates by `area × circularity × relative darkness`
8. Triggers pothole alert if top candidate confidence ≥ 0.40

No server calls. No API credits. Runs at ~5fps in any modern browser.

---

## Scoring Engine

The civic score starts at **85** and adjusts per event:

| Event | Score Change |
|---|---|
| Pothole detected | −15 |
| Waterlogging | −15 |
| Lane violation | −10 |
| Signal violation | −10 |
| Helmet missing | −12 |
| Wrong-side driving | −8 |
| Pedestrian risk | −7 |
| Honking spike | −5 |
| Smooth driving bonus | +3 |

**Risk thresholds:** LOW ≥ 75 · MODERATE 50–74 · HIGH < 50

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | Recent driving events (Mumbai seeded data) |
| POST | `/events` | Log a new driving event |
| GET | `/score` | Civic score + weekly trend |
| GET | `/route/risks` | Route risk zones (Sion → Andheri) |
| GET | `/city/insights` | City-level analytics (Mumbai) |
| GET | `/demo/steps` | 6-step automated demo scenario |
| POST | `/api/detect/frame` | GPT-4o Vision frame analysis (optional fallback) |

---

## Demo Screens

### `/demo` — Driver Demo
Upload any dashcam POV video or use the webcam. Toggle **CV Pothole Detector** to start real-time detection. Inject hazards manually via the Environment Injector to see the score change live. The HUD shows proximity alerts with distance countdowns.

### `/route` — Route Risk
Pre-trip analysis for the **Sion Circle → Andheri East** corridor in Mumbai. Dark map with 67 geoplotted potholes, risk zone halos, and a pulsing driver position pin.

### `/score` — Civic Score
Full score dashboard with sub-scores (Road Behaviour, Hazard Avoidance, Pedestrian Safety), weekly trend sparkline, and recent event log.

### `/city` — City Intelligence
Operator-facing dashboard. Violation category bar chart, priority hotspot list (Sion Circle, Kurla Junction, Dadar TT, BKC), and city-wide KPIs.

### `/scenario` — Demo Runner
Automated 6-step scenario that walks through a complete drive, firing events and showing real-time score changes without manual intervention. Good for unattended demos.

---

## Potential Use Cases

- **Insurance companies** — behaviour-based risk scoring for premium calculation
- **Municipal authorities** — live pothole and hazard density maps for road maintenance planning
- **Fleet operators** (logistics, delivery, cab aggregators) — driver monitoring at scale
- **Smart city platforms** — civic data layer for traffic and infrastructure planning
- **Two-wheeler safety** — real-time alerts for the highest-risk road user category in India

---

## Built With

This project was built as a hackathon MVP in a single sprint. The CV detection, scoring engine, route map, and city dashboard are all functional and data-driven with Mumbai-specific locations and realistic incident data.

---

## License

MIT
