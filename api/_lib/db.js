const { createClient } = require('@libsql/client');

let db;

function getDb() {
  if (!db) {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL || 'file:local.db',
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    });
  }
  return db;
}

async function initDb() {
  const client = getDb();
  await client.executeMultiple(`
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
      paid_at TEXT
    );
    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      url TEXT NOT NULL,
      events TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      secret TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      last_triggered TEXT
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
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      public_key TEXT NOT NULL,
      secret_key TEXT NOT NULL,
      sandbox_public_key TEXT NOT NULL,
      sandbox_secret_key TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return client;
}

module.exports = { getDb, initDb };
