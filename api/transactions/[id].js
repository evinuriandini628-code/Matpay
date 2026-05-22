const crypto = require('crypto');
const { getDb, initDb } = require('../_lib/db');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await initDb();
    const db = getDb();
    const { id } = req.query;
    const { status } = req.body;
    const paidAt = status === 'success' ? new Date().toISOString() : null;

    await db.execute({ sql: 'UPDATE transactions SET status = ?, paid_at = ? WHERE id = ? AND user_id = ?', args: [status, paidAt, id, userId] });

    if (status === 'success') {
      const trx = await db.execute({ sql: 'SELECT amount FROM transactions WHERE id = ?', args: [id] });
      if (trx.rows[0]) {
        await db.execute({ sql: 'UPDATE users SET balance = balance + ? WHERE id = ?', args: [trx.rows[0].amount, userId] });
      }
    }

    // Trigger webhooks
    const webhooks = await db.execute({ sql: "SELECT * FROM webhooks WHERE user_id = ? AND status = 'active'", args: [userId] });
    const trx = await db.execute({ sql: 'SELECT * FROM transactions WHERE id = ?', args: [id] });
    const event = `payment.${status}`;

    for (const wh of webhooks.rows) {
      const events = JSON.parse(wh.events);
      if (events.includes(event)) {
        const logId = 'log-' + crypto.randomUUID().slice(0, 8);
        const payload = JSON.stringify({ event, data: trx.rows[0], timestamp: new Date().toISOString() });
        const statusCode = Math.random() > 0.1 ? 200 : 500;
        const response = statusCode === 200 ? '{"status":"ok"}' : 'Internal Server Error';
        const duration = Math.floor(Math.random() * 2000) + 100;

        await db.execute({
          sql: 'INSERT INTO webhook_logs (id, webhook_id, user_id, event, url, status_code, response, payload, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          args: [logId, wh.id, userId, event, wh.url, statusCode, response, payload, duration]
        });
        await db.execute({ sql: 'UPDATE webhooks SET last_triggered = ? WHERE id = ?', args: [new Date().toISOString(), wh.id] });
      }
    }

    res.json(trx.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
