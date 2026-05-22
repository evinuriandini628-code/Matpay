const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '..', 'data', 'matpay.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'merchant',
    balance INTEGER DEFAULT 0,
    pending_balance INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    method TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    customer TEXT,
    email TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    paid_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS webhooks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    secret TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    last_triggered TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS webhook_logs (
    id TEXT PRIMARY KEY,
    webhook_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    event TEXT NOT NULL,
    url TEXT NOT NULL,
    status_code INTEGER,
    response TEXT,
    payload TEXT,
    duration INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (webhook_id) REFERENCES webhooks(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    public_key TEXT NOT NULL,
    secret_key TEXT NOT NULL,
    sandbox_public_key TEXT NOT NULL,
    sandbox_secret_key TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed demo user if none exist
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  const demoId = uuidv4();
  const hashedPassword = bcrypt.hashSync('password123', 10);
  db.prepare(`INSERT INTO users (id, name, email, password, phone, balance, pending_balance) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(demoId, 'MatPay Store', 'merchant@matpay.id', hashedPassword, '0812-3456-7890', 12450000, 8750000);

  // Seed API keys
  db.prepare(`INSERT INTO api_keys (id, user_id, public_key, secret_key, sandbox_public_key, sandbox_secret_key) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(uuidv4(), demoId, 'MP_PUB_live_' + uuidv4().slice(0, 12), 'MP_SEC_live_' + uuidv4().slice(0, 12), 'MP_PUB_sandbox_' + uuidv4().slice(0, 12), 'MP_SEC_sandbox_' + uuidv4().slice(0, 12));

  // Seed transactions
  const trxs = [
    { method: 'QRIS', amount: 150000, status: 'success', customer: 'John Doe', email: 'john@email.com' },
    { method: 'Virtual Account BCA', amount: 89000, status: 'pending', customer: 'Jane Smith', email: 'jane@email.com' },
    { method: 'E-Wallet GoPay', amount: 200000, status: 'failed', customer: 'Bob Wilson', email: 'bob@email.com' },
    { method: 'QRIS', amount: 75000, status: 'success', customer: 'Alice Brown', email: 'alice@email.com' },
    { method: 'Credit Card', amount: 500000, status: 'success', customer: 'Charlie Davis', email: 'charlie@email.com' },
    { method: 'Virtual Account Mandiri', amount: 320000, status: 'success', customer: 'Diana Evans', email: 'diana@email.com' },
    { method: 'E-Wallet OVO', amount: 45000, status: 'pending', customer: 'Edward Fisher', email: 'edward@email.com' },
    { method: 'QRIS', amount: 180000, status: 'success', customer: 'Fiona Garcia', email: 'fiona@email.com' },
  ];
  const insertTrx = db.prepare(`INSERT INTO transactions (id, user_id, method, amount, status, customer, email, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  trxs.forEach((t, i) => {
    insertTrx.run(`INV-240506-00${i + 1}`, demoId, t.method, t.amount, t.status, t.customer, t.email, t.status === 'success' ? new Date().toISOString() : null);
  });

  // Seed webhooks
  const wh1Id = 'wh-' + uuidv4().slice(0, 8);
  db.prepare(`INSERT INTO webhooks (id, user_id, url, events, status, secret) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(wh1Id, demoId, 'https://mystore.com/api/matpay/callback', JSON.stringify(['payment.success', 'payment.failed', 'payment.expired']), 'active', 'whsec_matpay_' + uuidv4().slice(0, 12));
  db.prepare(`INSERT INTO webhooks (id, user_id, url, events, status, secret) VALUES (?, ?, ?, ?, ?, ?)`)
    .run('wh-' + uuidv4().slice(0, 8), demoId, 'https://app.example.id/webhook/payment', JSON.stringify(['payment.success']), 'active', 'whsec_matpay_' + uuidv4().slice(0, 12));

  console.log('Database seeded with demo data');
}

module.exports = db;
