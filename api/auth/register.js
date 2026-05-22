// Register is handled on frontend via Firebase Auth SDK.
// After Firebase creates the user, frontend calls this to create the Firestore profile.
const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { name, phone } = req.body;

    // Check if user profile already exists
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) return res.json(userDoc.data());

    const userData = {
      uid,
      name: name || 'Merchant',
      phone: phone || null,
      role: 'merchant',
      balance: 0,
      pendingBalance: 0,
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').doc(uid).set(userData);

    // Create API keys
    const crypto = require('crypto');
    await db.collection('apiKeys').doc(uid).set({
      uid,
      publicKey: 'MP_PUB_live_' + crypto.randomUUID().replace(/-/g, '').slice(0, 24),
      secretKey: 'MP_SEC_live_' + crypto.randomUUID().replace(/-/g, '').slice(0, 24),
      sandboxPublicKey: 'MP_PUB_sandbox_' + crypto.randomUUID().replace(/-/g, '').slice(0, 24),
      sandboxSecretKey: 'MP_SEC_sandbox_' + crypto.randomUUID().replace(/-/g, '').slice(0, 24),
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
