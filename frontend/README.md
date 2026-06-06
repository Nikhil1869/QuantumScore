# QuantumScore Frontend

React + TypeScript web application for the QuantumScore sports prediction platform.

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite 8** — Build tool & dev server
- **Tailwind CSS 3** — Utility-first styling
- **Framer Motion** — Animations & transitions
- **Recharts** — Data visualization (analytics dashboard)
- **React Select** — Team selection dropdowns
- **Lucide React** — Icons

## Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── PredictionForm    # Match prediction input form
│   │   ├── PredictionResult  # Prediction output display
│   │   ├── AnalyticsDashboard # Charts & model performance
│   │   ├── PredictionHistoryTable # Past predictions
│   │   ├── RecentPredictions # Quick-view recent results
│   │   ├── SportSelector     # Football/Cricket/Basketball toggle
│   │   ├── TeamSelect        # Searchable team dropdown
│   │   ├── Card              # Generic card wrapper
│   │   └── ui/               # Base UI primitives
│   ├── lib/                  # Utilities & data
│   │   ├── predictor.ts      # API client for predictions
│   │   ├── sports-data.ts    # Team rosters & league data
│   │   ├── analytics-data.ts # Mock analytics data
│   │   └── utils.ts          # Helper functions (cn, etc.)
│   ├── pages/
│   │   └── Login.tsx         # Login page
│   └── App.tsx               # Root app with layout & routing
├── main.tsx                  # Entry point
└── index.css                 # Global styles & Tailwind directives
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Lint
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

## API Proxy

The Vite dev server proxies `/api/*` requests to the backend Express server on port 5000. See `vite.config.ts` for the proxy configuration.
