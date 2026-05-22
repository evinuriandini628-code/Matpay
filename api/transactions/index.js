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
    try {
      const { status, method, search, limit = '50', offset = '0' } = req.query;
      let sql = 'SELECT * FROM transactions WHERE user_id = ?';
      const args = [userId];

      if (status && status !== 'all') { sql += ' AND status = ?'; args.push(status); }
      if (method && method !== 'all') { sql += ' AND LOWER(method) LIKE ?'; args.push(`%${method.toLowerCase()}%`); }
      if (search) { sql += ' AND (id LIKE ? OR LOWER(customer) LIKE ?)'; args.push(`%${search}%`, `%${search.toLowerCase()}%`); }
      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      args.push(Number(limit), Number(offset));

      const result = await db.execute({ sql, args });
      const countResult = await db.execute({ sql: 'SELECT COUNT(*) as count FROM transactions WHERE user_id = ?', args: [userId] });
      res.json({ transactions: result.rows, total: countResult.rows[0].count });
    } catch (err) { res.status(500).json({ error: err.message }); }
  } else if (req.method === 'POST') {
    try {
      const { method, amount, customer, email } = req.body;
      if (!method || !amount || !customer) return res.status(400).json({ error: 'Method, amount, customer wajib' });

      const id = 'INV-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      await db.execute({ sql: 'INSERT INTO transactions (id, user_id, method, amount, status, customer, email) VALUES (?, ?, ?, ?, ?, ?, ?)', args: [id, userId, method, amount, 'pending', customer, email || null] });

      const result = await db.execute({ sql: 'SELECT * FROM transactions WHERE id = ?', args: [id] });
      res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
