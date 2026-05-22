const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { webhookId, event } = req.body;
    const whDoc = await db.collection('webhooks').doc(webhookId).get();
    if (!whDoc.exists || whDoc.data().uid !== uid) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    const wh = whDoc.data();
    const logId = 'log-' + crypto.randomUUID().slice(0, 8);
    const payload = JSON.stringify({ event, data: { id: 'TRX-TEST-' + Date.now(), amount: Math.floor(Math.random() * 500000) + 50000 }, timestamp: new Date().toISOString() });
    const statusCode = Math.random() > 0.2 ? 200 : 500;
    const response = statusCode === 200 ? '{"status":"ok"}' : 'Internal Server Error';
    const duration = Math.floor(Math.random() * 2000) + 100;

    const logData = { uid, webhookId, event, url: wh.url, statusCode, response, payload, duration, createdAt: new Date().toISOString() };
    await db.collection('webhookLogs').doc(logId).set(logData);
    await db.collection('webhooks').doc(webhookId).update({ lastTriggered: new Date().toISOString() });

    res.json({ id: logId, ...logData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
