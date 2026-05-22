const { getDb, initDb } = require('../_lib/db');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await initDb();
    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT id, name, email, phone, role, balance, pending_balance, created_at FROM users WHERE id = ?',
      args: [userId]
    });
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
