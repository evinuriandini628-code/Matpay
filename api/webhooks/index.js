const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const snapshot = await db.collection('webhooks').where('uid', '==', uid).orderBy('createdAt', 'desc').get();
    const webhooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(webhooks);
  } else if (req.method === 'POST') {
    const { url, events } = req.body;
    if (!url || !events || events.length === 0) {
      return res.status(400).json({ error: 'URL dan events wajib diisi' });
    }

    const id = 'wh-' + crypto.randomUUID().slice(0, 8);
    const secret = 'whsec_matpay_' + crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    const data = { uid, url, events, status: 'active', secret, createdAt: new Date().toISOString(), lastTriggered: null };

    await db.collection('webhooks').doc(id).set(data);
    res.status(201).json({ id, ...data });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
