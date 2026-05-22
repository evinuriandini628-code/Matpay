const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { id } = req.query;
    const { status } = req.body;
    const paidAt = status === 'success' ? new Date().toISOString() : null;

    const trxRef = db.collection('transactions').doc(id);
    const trxDoc = await trxRef.get();
    if (!trxDoc.exists || trxDoc.data().uid !== uid) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await trxRef.update({ status, paidAt });

    // Update balance if success
    if (status === 'success') {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      const currentBalance = userDoc.data().balance || 0;
      await userRef.update({ balance: currentBalance + trxDoc.data().amount });
    }

    // Trigger webhooks
    const webhooksSnap = await db.collection('webhooks')
      .where('uid', '==', uid)
      .where('status', '==', 'active')
      .get();

    const event = `payment.${status}`;
    const trxData = { id, ...trxDoc.data(), status, paidAt };

    for (const whDoc of webhooksSnap.docs) {
      const wh = whDoc.data();
      const events = wh.events || [];
      if (events.includes(event)) {
        const logId = 'log-' + crypto.randomUUID().slice(0, 8);
        const payload = JSON.stringify({ event, data: trxData, timestamp: new Date().toISOString() });
        const statusCode = Math.random() > 0.1 ? 200 : 500;
        const response = statusCode === 200 ? '{"status":"ok"}' : 'Internal Server Error';
        const duration = Math.floor(Math.random() * 2000) + 100;

        await db.collection('webhookLogs').doc(logId).set({
          uid,
          webhookId: whDoc.id,
          event,
          url: wh.url,
          statusCode,
          response,
          payload,
          duration,
          createdAt: new Date().toISOString(),
        });
        await db.collection('webhooks').doc(whDoc.id).update({ lastTriggered: new Date().toISOString() });
      }
    }

    res.json(trxData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
