const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// GET /api/backlog - returns backlog.md contents
app.get('/api/backlog', (req, res) => {
  try {
    const backlogPath = path.join(process.env.HOME, '.openclaw/workspace/backlog.md');
    const content = fs.readFileSync(backlogPath, 'utf-8');
    res.json({ content, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error reading backlog:', error);
    res.status(500).json({ error: 'Failed to read backlog' });
  }
});

// GET /api/costs/today - returns today's cost breakdown
app.get('/api/costs/today', (req, res) => {
  try {
    const agentsDir = path.join(process.env.HOME, '.openclaw/agents');
    const agents = ['main', 'forge', 'grid', 'pulse', 'scout', 'pixel', 'sage'];
    
    // Today's date in YYYY-MM-DD format (Feb 9, 2026)
    const today = new Date().toISOString().split('T')[0];
    
    let totalCost = 0;
    const byAgent = {};
    const byModel = {};
    
    agents.forEach(agent => {
      const sessionsDir = path.join(agentsDir, agent, 'sessions');
      if (!fs.existsSync(sessionsDir)) return;
      
      const sessionFiles = fs.readdirSync(sessionsDir)
        .filter(f => f.endsWith('.jsonl'));
      
      sessionFiles.forEach(file => {
        const filePath = path.join(sessionsDir, file);
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(l => l.trim());
        
        lines.forEach(line => {
          try {
            const entry = JSON.parse(line);
            
            // Check if entry is from today
            if (entry.timestamp && entry.timestamp.startsWith(today)) {
              if (entry.type === 'message' && entry.message?.usage?.cost) {
                const cost = entry.message.usage.cost.total || 0;
                const model = entry.message.model || 'unknown';
                
                totalCost += cost;
                
                // By agent
                if (!byAgent[agent]) {
                  byAgent[agent] = { cost: 0, messages: 0 };
                }
                byAgent[agent].cost += cost;
                byAgent[agent].messages += 1;
                
                // By model
                if (!byModel[model]) {
                  byModel[model] = { cost: 0, messages: 0 };
                }
                byModel[model].cost += cost;
                byModel[model].messages += 1;
              }
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        });
      });
    });
    
    res.json({
      date: today,
      totalCost,
      byAgent,
      byModel,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error calculating today\'s costs:', error);
    res.status(500).json({ error: 'Failed to calculate costs' });
  }
});

// GET /api/costs/history - returns last 7 days from cost-reports/
app.get('/api/costs/history', (req, res) => {
  try {
    const reportsDir = path.join(process.env.HOME, '.openclaw/cost-reports');
    
    if (!fs.existsSync(reportsDir)) {
      return res.json({ days: [] });
    }
    
    const reportFiles = fs.readdirSync(reportsDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, 7);
    
    const days = reportFiles.map(file => {
      const filePath = path.join(reportsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data;
    }).sort((a, b) => a.date.localeCompare(b.date));
    
    res.json({ days, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error reading cost history:', error);
    res.status(500).json({ error: 'Failed to read cost history' });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Kit Control Panel API running on port ${PORT}`);
});
