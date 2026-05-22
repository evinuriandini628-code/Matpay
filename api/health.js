module.exports = function handler(req, res) {
  res.json({ status: 'ok', service: 'MatPay API', platform: 'Vercel', time: new Date().toISOString() });
};
