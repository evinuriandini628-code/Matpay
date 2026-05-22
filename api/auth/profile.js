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
    const { name, phone } = req.body;

    if (name) await db.execute({ sql: 'UPDATE users SET name = ? WHERE id = ?', args: [name, userId] });
    if (phone) await db.execute({ sql: 'UPDATE users SET phone = ? WHERE id = ?', args: [phone, userId] });

    const result = await db.execute({
      sql: 'SELECT id, name, email, phone, role, balance, pending_balance FROM users WHERE id = ?',
      args: [userId]
    });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
