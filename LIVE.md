# 🚀 Kit Control Panel - LIVE

## Live URL
**https://long-monkeys-divide.loca.lt**

## What's Working
✅ **Live Backlog Feed** - Auto-refreshes every 30 seconds
✅ **Today's Cost Tracking** - Updates every 60 seconds, breakdown by agent & model
✅ **Historical Cost Data** - Last 7 days with Chart.js visualizations
✅ **Dark Mode Toggle** - Persistent preference
✅ **Mobile-Friendly** - Responsive design
✅ **Linear/Notion Styling** - Clean, modern UI

## Tech Stack
- **Frontend**: React 18 + Vite 7
- **UI**: Tailwind CSS 3
- **Charts**: Chart.js 4 + react-chartjs-2
- **Backend**: Node.js + Express
- **Deployment**: Local server + localtunnel proxy

## GitHub Repository
https://github.com/maxdevs97/kit-control-panel

## Architecture
```
┌─────────────────┐
│   Browser       │
│  (Any device)   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  localtunnel    │
│  Proxy Service  │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Node Server   │
│  localhost:3001 │
└────────┬────────┘
         │ File reads
         ▼
┌─────────────────┐
│  ~/.openclaw/   │
│  Local Files    │
└─────────────────┘
```

## Data Sources
- Backlog: `/Users/max/.openclaw/workspace/backlog.md`
- Today's logs: `~/.openclaw/agents/*/sessions/*.jsonl`
- History: `~/.openclaw/cost-reports/*.json`

## API Endpoints
- `GET /api/backlog` - Returns backlog.md contents
- `GET /api/costs/today` - Today's cost breakdown
- `GET /api/costs/history` - Last 7 days

## Notes
- The tunnel URL is temporary (changes on restart)
- For permanent URL, consider:
  - Running on a VPS with rsync to sync OpenClaw files
  - Using ngrok with a reserved domain
  - Setting up DigitalOcean with file syncing

Built by Forge 🔨
Completed: Feb 10, 2026
