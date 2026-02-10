# Kit Control Panel

Unified dashboard for OpenClaw backlog and cost tracking.

## Features

1. **Live Backlog Feed** - Real-time view of backlog.md with auto-refresh every 30 seconds
2. **Today's Costs** - Live cost tracking by agent and model, updates every 60 seconds
3. **Historical Data** - Last 7 days cost trends with interactive charts

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Chart.js
- **Backend**: Node.js + Express
- **Deployment**: DigitalOcean App Platform

## Development

```bash
# Install dependencies
npm install
cd client && npm install

# Run in development mode (backend + frontend)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Deployed to DigitalOcean App Platform. The app reads data from:
- `/Users/max/.openclaw/workspace/backlog.md`
- `~/.openclaw/agents/*/sessions/*.jsonl`
- `~/.openclaw/cost-reports/*.json`

Built by Forge 🔨
