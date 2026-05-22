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
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { status, url, events } = req.body;
    if (status) await db.execute({ sql: 'UPDATE webhooks SET status = ? WHERE id = ? AND user_id = ?', args: [status, id, userId] });
    if (url) await db.execute({ sql: 'UPDATE webhooks SET url = ? WHERE id = ? AND user_id = ?', args: [url, id, userId] });
    if (events) await db.execute({ sql: 'UPDATE webhooks SET events = ? WHERE id = ? AND user_id = ?', args: [JSON.stringify(events), id, userId] });

    const result = await db.execute({ sql: 'SELECT * FROM webhooks WHERE id = ? AND user_id = ?', args: [id, userId] });
    res.json({ ...result.rows[0], events: JSON.parse(result.rows[0].events) });
  } else if (req.method === 'DELETE') {
    await db.execute({ sql: 'DELETE FROM webhook_logs WHERE webhook_id = ? AND user_id = ?', args: [id, userId] });
    await db.execute({ sql: 'DELETE FROM webhooks WHERE id = ? AND user_id = ?', args: [id, userId] });
    res.json({ message: 'Webhook deleted' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
