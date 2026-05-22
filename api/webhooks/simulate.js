const crypto = require('crypto');
const { getDb, initDb } = require('../_lib/db');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await initDb();
    const db = getDb();
    const { webhookId, event } = req.body;

    const whResult = await db.execute({ sql: 'SELECT * FROM webhooks WHERE id = ? AND user_id = ?', args: [webhookId, userId] });
    if (whResult.rows.length === 0) return res.status(404).json({ error: 'Webhook not found' });

    const wh = whResult.rows[0];
    const logId = 'log-' + crypto.randomUUID().slice(0, 8);
    const payload = JSON.stringify({ event, data: { id: 'TRX-TEST-' + Date.now(), amount: Math.floor(Math.random() * 500000) + 50000 }, timestamp: new Date().toISOString() });
    const statusCode = Math.random() > 0.2 ? 200 : 500;
    const response = statusCode === 200 ? '{"status":"ok"}' : 'Internal Server Error';
    const duration = Math.floor(Math.random() * 2000) + 100;

    await db.execute({
      sql: 'INSERT INTO webhook_logs (id, webhook_id, user_id, event, url, status_code, response, payload, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [logId, wh.id, userId, event, wh.url, statusCode, response, payload, duration]
    });
    await db.execute({ sql: 'UPDATE webhooks SET last_triggered = ? WHERE id = ?', args: [new Date().toISOString(), wh.id] });

    const logResult = await db.execute({ sql: 'SELECT * FROM webhook_logs WHERE id = ?', args: [logId] });
    res.json(logResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
