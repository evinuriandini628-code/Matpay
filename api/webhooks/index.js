const crypto = require('crypto');
const { getDb, initDb } = require('../_lib/db');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  await initDb();
  const db = getDb();

  if (req.method === 'GET') {
    const result = await db.execute({ sql: 'SELECT * FROM webhooks WHERE user_id = ? ORDER BY created_at DESC', args: [userId] });
    const parsed = result.rows.map(w => ({ ...w, events: JSON.parse(w.events) }));
    res.json(parsed);
  } else if (req.method === 'POST') {
    const { url, events } = req.body;
    if (!url || !events || events.length === 0) return res.status(400).json({ error: 'URL dan events wajib' });

    const id = 'wh-' + crypto.randomUUID().slice(0, 8);
    const secret = 'whsec_matpay_' + crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    await db.execute({ sql: 'INSERT INTO webhooks (id, user_id, url, events, status, secret) VALUES (?, ?, ?, ?, ?, ?)', args: [id, userId, url, JSON.stringify(events), 'active', secret] });

    const result = await db.execute({ sql: 'SELECT * FROM webhooks WHERE id = ?', args: [id] });
    res.status(201).json({ ...result.rows[0], events: JSON.parse(result.rows[0].events) });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
