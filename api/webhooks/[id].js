const { db } = require('../_lib/firebase-admin');
const { verifyToken } = require('../_lib/auth');
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  const uid = await verifyToken(req);
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { status, url, events } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (url) updates.url = url;
    if (events) updates.events = events;

    await db.collection('webhooks').doc(id).update(updates);
    const doc = await db.collection('webhooks').doc(id).get();
    res.json({ id, ...doc.data() });
  } else if (req.method === 'DELETE') {
    // Delete logs first
    const logsSnap = await db.collection('webhookLogs').where('webhookId', '==', id).get();
    const batch = db.batch();
    logsSnap.docs.forEach(d => batch.delete(d.ref));
    batch.delete(db.collection('webhooks').doc(id));
    await batch.commit();
    res.json({ message: 'Webhook deleted' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
