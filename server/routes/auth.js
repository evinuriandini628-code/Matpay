const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)')
      .run(id, name, email, hashedPassword, phone || null);

    // Create API keys for new user
    db.prepare('INSERT INTO api_keys (id, user_id, public_key, secret_key, sandbox_public_key, sandbox_secret_key) VALUES (?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), id, 'MP_PUB_live_' + uuidv4().slice(0, 12), 'MP_SEC_live_' + uuidv4().slice(0, 12), 'MP_PUB_sandbox_' + uuidv4().slice(0, 12), 'MP_SEC_sandbox_' + uuidv4().slice(0, 12));

    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' });
    const user = db.prepare('SELECT id, name, email, phone, role, balance, pending_balance FROM users WHERE id = ?').get(id);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, role, balance, pending_balance, created_at FROM users WHERE id = ?').get(req.userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { name, phone } = req.body;
    db.prepare('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?')
      .run(name || null, phone || null, req.userId);
    const user = db.prepare('SELECT id, name, email, phone, role, balance, pending_balance FROM users WHERE id = ?').get(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
