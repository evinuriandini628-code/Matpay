require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Firebase Admin init
const admin = require('firebase-admin');
if (!admin.apps.length) {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  sa.private_key = (sa.private_key || '').replace(/\\n/g, '\n');
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}
const db = admin.firestore();
const authAdmin = admin.auth();

// Auth middleware
async function mw(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try { req.uid = (await authAdmin.verifyIdToken(h.split(' ')[1])).uid; next(); }
  catch { return res.status(401).json({ error: 'Token invalid' }); }
}

// AUTH
app.post('/api/auth/register', mw, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const ex = await db.collection('users').doc(req.uid).get();
    if (ex.exists) return res.json(ex.data());
    const u = { name: name||'Merchant', phone: phone||null, role:'merchant', balance:0, pendingBalance:0, createdAt: new Date().toISOString() };
    await db.collection('users').doc(req.uid).set(u);
    await db.collection('apiKeys').doc(req.uid).set({ publicKey:'MP_PUB_live_'+crypto.randomUUID().slice(0,24), secretKey:'MP_SEC_live_'+crypto.randomUUID().slice(0,24), sandboxPublicKey:'MP_PUB_sandbox_'+crypto.randomUUID().slice(0,24), sandboxSecretKey:'MP_SEC_sandbox_'+crypto.randomUUID().slice(0,24) });
    res.status(201).json(u);
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/auth/me', mw, async (req, res) => {
  try { const d = await db.collection('users').doc(req.uid).get(); if(!d.exists) return res.status(404).json({error:'Not found'}); res.json({uid:req.uid,...d.data()}); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.put('/api/auth/profile', mw, async (req, res) => {
  try { const {name,phone}=req.body; const u={}; if(name)u.name=name; if(phone)u.phone=phone; await db.collection('users').doc(req.uid).update(u); const d=await db.collection('users').doc(req.uid).get(); res.json({uid:req.uid,...d.data()}); }
  catch(e) { res.status(500).json({error:e.message}); }
});

// TRANSACTIONS
app.get('/api/transactions/stats', mw, async (req, res) => {
  try { const s=await db.collection('transactions').where('uid','==',req.uid).get(); const all=s.docs.map(d=>d.data()); const ud=await db.collection('users').doc(req.uid).get(); const user=ud.exists?ud.data():{}; res.json({totalTransactions:all.length,successCount:all.filter(t=>t.status==='success').length,totalVolume:all.filter(t=>t.status==='success').reduce((s,t)=>s+(t.amount||0),0),balance:user.balance||0,pendingBalance:user.pendingBalance||0}); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/transactions', mw, async (req, res) => {
  try { const s=await db.collection('transactions').where('uid','==',req.uid).orderBy('createdAt','desc').limit(50).get(); res.json({transactions:s.docs.map(d=>({id:d.id,...d.data()})),total:s.size}); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.post('/api/transactions', mw, async (req, res) => {
  try { const{method,amount,customer,email}=req.body; if(!method||!amount||!customer)return res.status(400).json({error:'Missing fields'}); const id='INV-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+String(Math.floor(Math.random()*1000)).padStart(3,'0'); const data={uid:req.uid,method,amount:Number(amount),status:'pending',customer,email:email||null,createdAt:new Date().toISOString(),paidAt:null}; await db.collection('transactions').doc(id).set(data); res.status(201).json({id,...data}); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.put('/api/transactions/:id', mw, async (req, res) => {
  try { const{status}=req.body; const ref=db.collection('transactions').doc(req.params.id); const doc=await ref.get(); if(!doc.exists)return res.status(404).json({error:'Not found'}); const paidAt=status==='success'?new Date().toISOString():null; await ref.update({status,paidAt}); if(status==='success'){const ur=db.collection('users').doc(req.uid);const u=await ur.get();await ur.update({balance:(u.data().balance||0)+doc.data().amount});} res.json({id:req.params.id,...doc.data(),status,paidAt}); }
  catch(e) { res.status(500).json({error:e.message}); }
});

// WEBHOOKS
app.get('/api/webhooks/logs', mw, async (req, res) => {
  try { const s=await db.collection('webhookLogs').where('uid','==',req.uid).orderBy('createdAt','desc').limit(50).get(); res.json(s.docs.map(d=>({id:d.id,...d.data()}))); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/webhooks', mw, async (req, res) => {
  try { const s=await db.collection('webhooks').where('uid','==',req.uid).orderBy('createdAt','desc').get(); res.json(s.docs.map(d=>({id:d.id,...d.data()}))); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.post('/api/webhooks/simulate', mw, async (req, res) => {
  try { const{webhookId,event}=req.body; const w=await db.collection('webhooks').doc(webhookId).get(); if(!w.exists)return res.status(404).json({error:'Not found'}); const logId='log-'+crypto.randomUUID().slice(0,8); const sc=Math.random()>0.2?200:500; const ld={uid:req.uid,webhookId,event,url:w.data().url,statusCode:sc,response:sc===200?'{"status":"ok"}':'Error',payload:JSON.stringify({event,data:{id:'TEST-'+Date.now(),amount:Math.floor(Math.random()*500000)+50000}}),duration:Math.floor(Math.random()*2000)+100,createdAt:new Date().toISOString()}; await db.collection('webhookLogs').doc(logId).set(ld); await db.collection('webhooks').doc(webhookId).update({lastTriggered:new Date().toISOString()}); res.json({id:logId,...ld}); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.post('/api/webhooks', mw, async (req, res) => {
  try { const{url,events}=req.body; if(!url||!events?.length)return res.status(400).json({error:'URL & events required'}); const id='wh-'+crypto.randomUUID().slice(0,8); const data={uid:req.uid,url,events,status:'active',secret:'whsec_matpay_'+crypto.randomUUID().replace(/-/g,'').slice(0,24),createdAt:new Date().toISOString(),lastTriggered:null}; await db.collection('webhooks').doc(id).set(data); res.status(201).json({id,...data}); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.put('/api/webhooks/:id', mw, async (req, res) => {
  try { const{status,url,events}=req.body; const u={}; if(status)u.status=status; if(url)u.url=url; if(events)u.events=events; await db.collection('webhooks').doc(req.params.id).update(u); const d=await db.collection('webhooks').doc(req.params.id).get(); res.json({id:req.params.id,...d.data()}); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.delete('/api/webhooks/:id', mw, async (req, res) => {
  try { await db.collection('webhooks').doc(req.params.id).delete(); res.json({message:'Deleted'}); }
  catch(e) { res.status(500).json({error:e.message}); }
});

// API KEYS
app.get('/api/keys', mw, async (req, res) => {
  try { const d=await db.collection('apiKeys').doc(req.uid).get(); if(!d.exists)return res.status(404).json({error:'Not found'}); res.json(d.data()); }
  catch(e) { res.status(500).json({error:e.message}); }
});
app.post('/api/keys', mw, async (req, res) => {
  try { const{keyType}=req.body; const p={publicKey:'MP_PUB_live_',secretKey:'MP_SEC_live_',sandboxPublicKey:'MP_PUB_sandbox_',sandboxSecretKey:'MP_SEC_sandbox_'}; if(!p[keyType])return res.status(400).json({error:'Invalid'}); await db.collection('apiKeys').doc(req.uid).update({[keyType]:p[keyType]+crypto.randomUUID().replace(/-/g,'').slice(0,24)}); const d=await db.collection('apiKeys').doc(req.uid).get(); res.json(d.data()); }
  catch(e) { res.status(500).json({error:e.message}); }
});

// Health
app.get('/api/health', (req, res) => res.json({ status:'ok', time: new Date().toISOString() }));

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')));

app.listen(PORT, () => console.log(`MatPay running on http://localhost:${PORT}`));
