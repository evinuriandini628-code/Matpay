const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const snapshot = await db.collection('transactions').where('uid', '==', uid).get();
    const transactions = snapshot.docs.map(d => d.data());

    const totalTransactions = transactions.length;
    const successCount = transactions.filter(t => t.status === 'success').length;
    const totalVolume = transactions.filter(t => t.status === 'success').reduce((s, t) => s + (t.amount || 0), 0);

    const userDoc = await db.collection('users').doc(uid).get();
    const user = userDoc.exists ? userDoc.data() : {};

    res.json({
      totalTransactions,
      successCount,
      totalVolume,
      balance: user.balance || 0,
      pendingBalance: user.pendingBalance || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
