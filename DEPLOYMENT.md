# Deployment Notes

## ⚠️ Important: Data Access Issue

The Kit Control Panel requires access to local OpenClaw files:
- `/Users/max/.openclaw/workspace/backlog.md`
- `~/.openclaw/agents/*/sessions/*.jsonl`
- `~/.openclaw/cost-reports/*.json`

**These files are on Max's Mac and cannot be accessed by a cloud-hosted app.**

## Solution Options

### Option 1: Local Deployment with Tunnel (RECOMMENDED)
Run the app locally on Max's Mac and expose it via ngrok or similar:

```bash
# Start the app locally
npm start

# In another terminal, create a tunnel
npx localtunnel --port 3001
# or
ngrok http 3001
```

This gives you a public URL that works anywhere while still accessing local files.

### Option 2: DigitalOcean with File Sync
Set up automatic file syncing from Max's Mac to DigitalOcean Spaces or S3, then modify the backend to read from there instead of local filesystem.

### Option 3: Hybrid API
Keep the file-reading backend running on Max's Mac, deploy only the frontend to DigitalOcean, and have the frontend call the local API via tunnel.

## Current Configuration

The `.do/app.yaml` is included for DigitalOcean deployment, but **it will not work without implementing one of the solutions above** because the cloud server cannot access Max's local files.

## Local Development

```bash
# Install dependencies
npm install
cd client && npm install

# Start in dev mode (backend + frontend)
npm run dev

# Or start separately:
npm run dev:server  # Backend on :3001
npm run dev:client  # Frontend on :5173

# Production build + start
npm run build
npm start
```

The app will be available at http://localhost:3001 (or :5173 in dev mode).
