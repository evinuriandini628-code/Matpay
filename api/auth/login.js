// Login is handled entirely on the frontend via Firebase Auth SDK.
// This endpoint exists only to keep route consistency. 
// Frontend uses firebase signInWithEmailAndPassword() directly.
const { cors } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  res.status(200).json({ message: 'Login is handled client-side via Firebase Auth SDK. Use signInWithEmailAndPassword().' });
};
