const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('transactions')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ transactions, total: transactions.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { method, amount, customer, email } = req.body;
      if (!method || !amount || !customer) {
        return res.status(400).json({ error: 'Method, amount, dan customer wajib diisi' });
      }

      const id = 'INV-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const trxData = {
        uid,
        method,
        amount: Number(amount),
        status: 'pending',
        customer,
        email: email || null,
        createdAt: new Date().toISOString(),
        paidAt: null,
      };

      await db.collection('transactions').doc(id).set(trxData);
      res.status(201).json({ id, ...trxData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
