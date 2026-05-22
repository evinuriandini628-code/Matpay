const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get all transactions
router.get('/', (req, res) => {
  try {
    const { status, method, search, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [req.userId];

    if (status && status !== 'all') { query += ' AND status = ?'; params.push(status); }
    if (method && method !== 'all') { query += ' AND LOWER(method) LIKE ?'; params.push(`%${method.toLowerCase()}%`); }
    if (search) { query += ' AND (id LIKE ? OR LOWER(customer) LIKE ? OR LOWER(email) LIKE ?)'; params.push(`%${search}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const transactions = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?').get(req.userId);
    res.json({ transactions, total: total.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create transaction (simulate payment)
router.post('/', (req, res) => {
  try {
    const { method, amount, customer, email } = req.body;
    if (!method || !amount || !customer) {
      return res.status(400).json({ error: 'Method, amount, dan customer wajib diisi' });
    }

    const id = 'INV-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    db.prepare('INSERT INTO transactions (id, user_id, method, amount, status, customer, email) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, req.userId, method, amount, 'pending', customer, email || null);

    const trx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    res.status(201).json(trx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update transaction status (simulate payment callback)
router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const paidAt = status === 'success' ? new Date().toISOString() : null;

    db.prepare('UPDATE transactions SET status = ?, paid_at = ? WHERE id = ? AND user_id = ?')
      .run(status, paidAt, req.params.id, req.userId);

    // If success, update balance
    if (status === 'success') {
      const trx = db.prepare('SELECT amount FROM transactions WHERE id = ?').get(req.params.id);
      if (trx) {
        db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(trx.amount, req.userId);
      }
    }

    // Trigger webhooks
    const webhooks = db.prepare("SELECT * FROM webhooks WHERE user_id = ? AND status = 'active'").all(req.userId);
    const trx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    const event = `payment.${status}`;

    webhooks.forEach((wh) => {
      const events = JSON.parse(wh.events);
      if (events.includes(event)) {
        const logId = 'log-' + uuidv4().slice(0, 8);
        const payload = JSON.stringify({ event, data: trx, timestamp: new Date().toISOString() });
        // Simulate webhook delivery (in production you'd use fetch/axios)
        const statusCode = Math.random() > 0.1 ? 200 : 500;
        const response = statusCode === 200 ? '{"status":"ok"}' : 'Internal Server Error';
        const duration = Math.floor(Math.random() * 2000) + 100;

        db.prepare('INSERT INTO webhook_logs (id, webhook_id, user_id, event, url, status_code, response, payload, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run(logId, wh.id, req.userId, event, wh.url, statusCode, response, payload, duration);
        db.prepare('UPDATE webhooks SET last_triggered = ? WHERE id = ?').run(new Date().toISOString(), wh.id);
      }
    });

    res.json(db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get dashboard stats
router.get('/stats', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?').get(req.userId);
    const success = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND status = 'success'").get(req.userId);
    const volume = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND status = 'success'").get(req.userId);
    const user = db.prepare('SELECT balance, pending_balance FROM users WHERE id = ?').get(req.userId);

    res.json({
      totalTransactions: total.count,
      successCount: success.count,
      totalVolume: volume.total,
      balance: user.balance,
      pendingBalance: user.pending_balance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
