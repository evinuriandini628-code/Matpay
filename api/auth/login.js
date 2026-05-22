const bcrypt = require('bcryptjs');
const { getDb, initDb } = require('../_lib/db');
const { signToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await initDb();
    const db = getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Email atau password salah' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email atau password salah' });

    const token = signToken(user.id);
    const { password: _, ...userSafe } = user;
    res.json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
