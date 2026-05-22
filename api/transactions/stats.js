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

    const total = await db.execute({ sql: 'SELECT COUNT(*) as count FROM transactions WHERE user_id = ?', args: [userId] });
    const success = await db.execute({ sql: "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND status = 'success'", args: [userId] });
    const volume = await db.execute({ sql: "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND status = 'success'", args: [userId] });
    const user = await db.execute({ sql: 'SELECT balance, pending_balance FROM users WHERE id = ?', args: [userId] });

    res.json({
      totalTransactions: total.rows[0].count,
      successCount: success.rows[0].count,
      totalVolume: volume.rows[0].total,
      balance: user.rows[0]?.balance || 0,
      pendingBalance: user.rows[0]?.pending_balance || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
