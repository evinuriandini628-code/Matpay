import React, { useState } from 'react';
import { KeyRound, Copy, Eye, EyeOff, RefreshCw, Shield, AlertTriangle, CheckCircle2, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { copyToClipboard } from '../utils/helpers';

export default function ApiKeys() {
  const apiKeys = useStore((s) => s.apiKeys);
  const regenerateKey = useStore((s) => s.regenerateKey);
  const [environment, setEnvironment] = useState('live');
  const [showKeys, setShowKeys] = useState({});

  const toggleShow = (key) => setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const keys = environment === 'live'
    ? [
        { id: 'publicKey', label: 'Public Key (Client)', value: apiKeys.publicKey, desc: 'Digunakan di frontend/client-side untuk tokenisasi' },
        { id: 'secretKey', label: 'Secret Key (Server)', value: apiKeys.secretKey, desc: 'Digunakan di backend/server-side. JANGAN expose di client!' },
      ]
    : [
        { id: 'sandboxPublicKey', label: 'Sandbox Public Key', value: apiKeys.sandboxPublicKey, desc: 'Public key untuk environment sandbox/testing' },
        { id: 'sandboxSecretKey', label: 'Sandbox Secret Key', value: apiKeys.sandboxSecretKey, desc: 'Secret key untuk environment sandbox/testing' },
      ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black">API Keys</h2>
        <p className="text-sm text-slate-500">Kelola API keys untuk integrasi payment gateway MatPay.</p>
      </motion.div>

      {/* Environment Toggle */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        <button onClick={() => setEnvironment('live')} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${environment === 'live' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          🟢 Live / Production
        </button>
        <button onClick={() => setEnvironment('sandbox')} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${environment === 'sandbox' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          🟡 Sandbox / Testing
        </button>
      </div>


      {/* Keys */}
      <div className="space-y-4">
        {keys.map((key) => (
          <motion.div key={key.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <KeyRound size={16} className="text-blue-600" />
                  <h4 className="font-bold">{key.label}</h4>
                </div>
                <p className="mt-1 text-xs text-slate-500">{key.desc}</p>
                <div className="mt-3 flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm">
                    {showKeys[key.id] ? key.value : '••••••••••••••••••••••••••••'}
                  </code>
                  <button onClick={() => toggleShow(key.id)} className="rounded-lg bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100">
                    {showKeys[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => copyToClipboard(key.value)} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => regenerateKey(key.id)} className="rounded-lg bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100" title="Regenerate">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Integration Example */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Code size={18} className="text-blue-600" />
          <h3 className="text-lg font-black">Quick Integration</h3>
        </div>
        <div className="rounded-xl bg-slate-900 p-5">
          <pre className="overflow-x-auto text-sm text-green-400"><code>{`// Install SDK
// npm install matpay-node

const MatPay = require('matpay-node');
const matpay = new MatPay({
  serverKey: '${environment === 'live' ? 'MP_SEC_live_xxx' : 'MP_SEC_sandbox_xxx'}',
  isProduction: ${environment === 'live'}
});

// Create Payment
const payment = await matpay.createPayment({
  orderId: 'ORDER-001',
  amount: 150000,
  method: 'qris', // qris | va_bca | ewallet_gopay | credit_card
  customer: {
    name: 'John Doe',
    email: 'john@email.com',
    phone: '081234567890'
  },
  callbackUrl: 'https://yourdomain.com/webhook/matpay',
  redirectUrl: 'https://yourdomain.com/payment/success'
});

console.log(payment.paymentUrl);
// https://pay.matpay.id/v1/xxxx`}</code></pre>
        </div>
      </motion.div>

      {/* Security Warning */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 text-amber-600" />
          <div>
            <h4 className="font-bold text-amber-800">Penting!</h4>
            <ul className="mt-2 space-y-1 text-sm text-amber-700/80">
              <li>• Jangan pernah expose Secret Key di frontend atau repository publik</li>
              <li>• Gunakan environment variable untuk menyimpan API keys</li>
              <li>• Regenerate key jika Anda mencurigai adanya kebocoran</li>
              <li>• Gunakan Sandbox key untuk pengembangan dan testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
