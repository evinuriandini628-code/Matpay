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
    const result = await db.execute({ sql: 'SELECT * FROM api_keys WHERE user_id = ?', args: [userId] });
    if (result.rows.length === 0) return res.status(404).json({ error: 'API keys not found' });
    res.json(result.rows[0]);
  } else if (req.method === 'POST') {
    // Regenerate key
    const { keyType } = req.body;
    const validTypes = ['public_key', 'secret_key', 'sandbox_public_key', 'sandbox_secret_key'];
    if (!validTypes.includes(keyType)) return res.status(400).json({ error: 'Invalid key type' });

    const prefix = keyType.includes('sandbox')
      ? (keyType.includes('public') ? 'MP_PUB_sandbox_' : 'MP_SEC_sandbox_')
      : (keyType.includes('public') ? 'MP_PUB_live_' : 'MP_SEC_live_');

    const newKey = prefix + crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    await db.execute({ sql: `UPDATE api_keys SET ${keyType} = ? WHERE user_id = ?`, args: [newKey, userId] });

    const result = await db.execute({ sql: 'SELECT * FROM api_keys WHERE user_id = ?', args: [userId] });
    res.json(result.rows[0]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
