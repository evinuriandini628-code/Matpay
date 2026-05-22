const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get all webhooks
router.get('/', (req, res) => {
  try {
    const webhooks = db.prepare('SELECT * FROM webhooks WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
    const parsed = webhooks.map(w => ({ ...w, events: JSON.parse(w.events) }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create webhook
router.post('/', (req, res) => {
  try {
    const { url, events } = req.body;
    if (!url || !events || events.length === 0) {
      return res.status(400).json({ error: 'URL dan events wajib diisi' });
    }

    const id = 'wh-' + uuidv4().slice(0, 8);
    const secret = 'whsec_matpay_' + uuidv4().replace(/-/g, '').slice(0, 24);
    db.prepare('INSERT INTO webhooks (id, user_id, url, events, status, secret) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, req.userId, url, JSON.stringify(events), 'active', secret);

    const wh = db.prepare('SELECT * FROM webhooks WHERE id = ?').get(id);
    res.status(201).json({ ...wh, events: JSON.parse(wh.events) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update webhook (toggle status)
router.put('/:id', (req, res) => {
  try {
    const { status, url, events } = req.body;
    if (status) db.prepare('UPDATE webhooks SET status = ? WHERE id = ? AND user_id = ?').run(status, req.params.id, req.userId);
    if (url) db.prepare('UPDATE webhooks SET url = ? WHERE id = ? AND user_id = ?').run(url, req.params.id, req.userId);
    if (events) db.prepare('UPDATE webhooks SET events = ? WHERE id = ? AND user_id = ?').run(JSON.stringify(events), req.params.id, req.userId);

    const wh = db.prepare('SELECT * FROM webhooks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
    res.json({ ...wh, events: JSON.parse(wh.events) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete webhook
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM webhook_logs WHERE webhook_id = ? AND user_id = ?').run(req.params.id, req.userId);
    db.prepare('DELETE FROM webhooks WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
    res.json({ message: 'Webhook deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simulate webhook
router.post('/:id/simulate', (req, res) => {
  try {
    const { event } = req.body;
    const wh = db.prepare('SELECT * FROM webhooks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
    if (!wh) return res.status(404).json({ error: 'Webhook not found' });

    const logId = 'log-' + uuidv4().slice(0, 8);
    const payload = JSON.stringify({ event, data: { id: 'TRX-TEST-' + Date.now(), amount: Math.floor(Math.random() * 500000) + 50000 }, timestamp: new Date().toISOString() });
    const statusCode = Math.random() > 0.2 ? 200 : 500;
    const response = statusCode === 200 ? '{"status":"ok"}' : 'Internal Server Error';
    const duration = Math.floor(Math.random() * 2000) + 100;

    db.prepare('INSERT INTO webhook_logs (id, webhook_id, user_id, event, url, status_code, response, payload, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(logId, wh.id, req.userId, event, wh.url, statusCode, response, payload, duration);
    db.prepare('UPDATE webhooks SET last_triggered = ? WHERE id = ?').run(new Date().toISOString(), wh.id);

    const log = db.prepare('SELECT * FROM webhook_logs WHERE id = ?').get(logId);
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get webhook logs
router.get('/logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM webhook_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.userId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
