const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb, initDb } = require('../_lib/db');
const { signToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

function uuid() { return crypto.randomUUID(); }

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await initDb();
    const db = getDb();
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
    }

    const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const id = uuid();
    const hashed = bcrypt.hashSync(password, 10);
    await db.execute({ sql: 'INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)', args: [id, name, email, hashed, phone || null] });

    // Create API keys
    await db.execute({
      sql: 'INSERT INTO api_keys (id, user_id, public_key, secret_key, sandbox_public_key, sandbox_secret_key) VALUES (?, ?, ?, ?, ?, ?)',
      args: [uuid(), id, 'MP_PUB_live_' + uuid().slice(0, 12), 'MP_SEC_live_' + uuid().slice(0, 12), 'MP_PUB_sandbox_' + uuid().slice(0, 12), 'MP_SEC_sandbox_' + uuid().slice(0, 12)]
    });

    const token = signToken(id);
    const result = await db.execute({ sql: 'SELECT id, name, email, phone, role, balance, pending_balance FROM users WHERE id = ?', args: [id] });
    res.status(201).json({ token, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
