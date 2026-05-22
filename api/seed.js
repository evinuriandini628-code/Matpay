const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb, initDb } = require('./_lib/db');
const { cors } = require('./_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only. Call this once to seed demo data.' });

  try {
    await initDb();
    const db = getDb();

    // Check if already seeded
    const existing = await db.execute({ sql: "SELECT id FROM users WHERE email = 'merchant@matpay.id'", args: [] });
    if (existing.rows.length > 0) {
      return res.json({ message: 'Already seeded', userId: existing.rows[0].id });
    }

    const id = crypto.randomUUID();
    const hashed = bcrypt.hashSync('password123', 10);

    await db.execute({ sql: 'INSERT INTO users (id, name, email, password, phone, balance, pending_balance) VALUES (?, ?, ?, ?, ?, ?, ?)', args: [id, 'MatPay Store', 'merchant@matpay.id', hashed, '0812-3456-7890', 12450000, 8750000] });
    await db.execute({ sql: 'INSERT INTO api_keys (id, user_id, public_key, secret_key, sandbox_public_key, sandbox_secret_key) VALUES (?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), id, 'MP_PUB_live_' + crypto.randomUUID().slice(0, 12), 'MP_SEC_live_' + crypto.randomUUID().slice(0, 12), 'MP_PUB_sandbox_' + crypto.randomUUID().slice(0, 12), 'MP_SEC_sandbox_' + crypto.randomUUID().slice(0, 12)] });

    const trxs = [
      { method: 'QRIS', amount: 150000, status: 'success', customer: 'John Doe', email: 'john@email.com' },
      { method: 'Virtual Account BCA', amount: 89000, status: 'pending', customer: 'Jane Smith', email: 'jane@email.com' },
      { method: 'E-Wallet GoPay', amount: 200000, status: 'failed', customer: 'Bob Wilson', email: 'bob@email.com' },
      { method: 'Credit Card', amount: 500000, status: 'success', customer: 'Charlie Davis', email: 'charlie@email.com' },
      { method: 'Virtual Account Mandiri', amount: 320000, status: 'success', customer: 'Diana Evans', email: 'diana@email.com' },
    ];
    for (let i = 0; i < trxs.length; i++) {
      const t = trxs[i];
      await db.execute({ sql: 'INSERT INTO transactions (id, user_id, method, amount, status, customer, email, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', args: [`INV-240506-00${i + 1}`, id, t.method, t.amount, t.status, t.customer, t.email, t.status === 'success' ? new Date().toISOString() : null] });
    }

    // Seed webhook
    const whId = 'wh-' + crypto.randomUUID().slice(0, 8);
    await db.execute({ sql: 'INSERT INTO webhooks (id, user_id, url, events, status, secret) VALUES (?, ?, ?, ?, ?, ?)', args: [whId, id, 'https://mystore.com/api/matpay/callback', JSON.stringify(['payment.success', 'payment.failed']), 'active', 'whsec_matpay_' + crypto.randomUUID().slice(0, 12)] });

    res.json({ message: 'Database seeded successfully!', credentials: { email: 'merchant@matpay.id', password: 'password123' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
