const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const doc = await db.collection('apiKeys').doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'API keys not found' });
    res.json(doc.data());
  } else if (req.method === 'POST') {
    // Regenerate key
    const { keyType } = req.body;
    const validTypes = ['publicKey', 'secretKey', 'sandboxPublicKey', 'sandboxSecretKey'];
    if (!validTypes.includes(keyType)) return res.status(400).json({ error: 'Invalid key type' });

    const prefixMap = { publicKey: 'MP_PUB_live_', secretKey: 'MP_SEC_live_', sandboxPublicKey: 'MP_PUB_sandbox_', sandboxSecretKey: 'MP_SEC_sandbox_' };
    const newKey = prefixMap[keyType] + crypto.randomUUID().replace(/-/g, '').slice(0, 24);

    await db.collection('apiKeys').doc(uid).update({ [keyType]: newKey });
    const doc = await db.collection('apiKeys').doc(uid).get();
    res.json(doc.data());
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
