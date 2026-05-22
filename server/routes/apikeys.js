const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get API keys
router.get('/', (req, res) => {
  try {
    const keys = db.prepare('SELECT * FROM api_keys WHERE user_id = ?').get(req.userId);
    if (!keys) return res.status(404).json({ error: 'API keys not found' });
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Regenerate a specific key
router.post('/regenerate', (req, res) => {
  try {
    const { keyType } = req.body; // public_key, secret_key, sandbox_public_key, sandbox_secret_key
    const validTypes = ['public_key', 'secret_key', 'sandbox_public_key', 'sandbox_secret_key'];
    if (!validTypes.includes(keyType)) {
      return res.status(400).json({ error: 'Invalid key type' });
    }

    const prefix = keyType.includes('sandbox')
      ? (keyType.includes('public') ? 'MP_PUB_sandbox_' : 'MP_SEC_sandbox_')
      : (keyType.includes('public') ? 'MP_PUB_live_' : 'MP_SEC_live_');

    const newKey = prefix + uuidv4().replace(/-/g, '').slice(0, 24);
    db.prepare(`UPDATE api_keys SET ${keyType} = ? WHERE user_id = ?`).run(newKey, req.userId);

    const keys = db.prepare('SELECT * FROM api_keys WHERE user_id = ?').get(req.userId);
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
