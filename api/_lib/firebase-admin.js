const admin = require('firebase-admin');

if (!admin.apps.length) {
  // Satu variabel saja: JSON string dari service account
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  serviceAccount.private_key = (serviceAccount.private_key || '').replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
