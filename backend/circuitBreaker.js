import fs from 'fs';
import path from 'path';

// Use a simple JSON file instead of SQLite to avoid native build issues
const DB_FILE = path.resolve('usage.json');

// Initialize DB file if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ logs: [] }));
}

const DAILY_REQUEST_LIMIT = parseInt(process.env.DAILY_REQUEST_LIMIT || '100', 10);

export const circuitBreaker = {
  checkLimit: () => {
    if (process.env.SAFETY_ENABLED === '0') return true;

    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD (UTC)

      // Filter logs for today
      const todaysLogs = data.logs.filter(log => log.timestamp.startsWith(today));

      if (todaysLogs.length >= DAILY_REQUEST_LIMIT) {
        console.warn(`[CircuitBreaker] Daily limit reached: ${todaysLogs.length}/${DAILY_REQUEST_LIMIT}`);
        return false; // Blocked
      }
      return true; // Allowed
    } catch (e) {
      console.error('[CircuitBreaker] Error reading DB:', e);
      return true; // Fail open if DB error
    }
  },

  recordUsage: (type = 'GEMINI_ANALYSIS', cost = 0) => {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      data.logs.push({
        timestamp: new Date().toISOString(),
        type,
        cost_estimate: cost
      });
      // Keep only last 3 days to avoid indefinite growth
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const cutoff = threeDaysAgo.toISOString();
      data.logs = data.logs.filter(log => log.timestamp > cutoff);

      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
      console.log(`[CircuitBreaker] Recorded usage: ${type}`);
    } catch (e) {
      console.error('[CircuitBreaker] Error writing DB:', e);
    }
  },

  getStats: () => {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      const today = new Date().toISOString().split('T')[0];
      const todaysLogs = data.logs.filter(log => log.timestamp.startsWith(today));
      return { count: todaysLogs.length };
    } catch (e) {
      return { count: 0 };
    }
  }
};

