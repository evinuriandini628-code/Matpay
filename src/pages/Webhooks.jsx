import React, { useState } from 'react';
import { Webhook, Plus, Trash2, Play, Eye, EyeOff, Copy, CheckCircle2, XCircle, Clock, RefreshCw, Send, AlertTriangle, Globe, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatDate, timeAgo, copyToClipboard, getStatusColor } from '../utils/helpers';

const availableEvents = [
  { id: 'payment.success', label: 'Payment Success', desc: 'Ketika pembayaran berhasil dikonfirmasi' },
  { id: 'payment.failed', label: 'Payment Failed', desc: 'Ketika pembayaran gagal diproses' },
  { id: 'payment.expired', label: 'Payment Expired', desc: 'Ketika pembayaran melewati batas waktu' },
  { id: 'payment.pending', label: 'Payment Pending', desc: 'Ketika pembayaran menunggu konfirmasi' },
  { id: 'refund.success', label: 'Refund Success', desc: 'Ketika refund berhasil diproses' },
  { id: 'refund.failed', label: 'Refund Failed', desc: 'Ketika refund gagal diproses' },
  { id: 'settlement.completed', label: 'Settlement Completed', desc: 'Ketika settlement selesai ditransfer' },
  { id: 'disbursement.success', label: 'Disbursement Success', desc: 'Ketika pencairan dana berhasil' },
];

export default function Webhooks() {
  const webhooks = useStore((s) => s.webhooks);
  const webhookLogs = useStore((s) => s.webhookLogs);
  const addWebhook = useStore((s) => s.addWebhook);
  const updateWebhook = useStore((s) => s.updateWebhook);
  const deleteWebhook = useStore((s) => s.deleteWebhook);
  const simulateWebhook = useStore((s) => s.simulateWebhook);

  const [activeTab, setActiveTab] = useState('endpoints');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogDetail, setShowLogDetail] = useState(null);
  const [showSimulate, setShowSimulate] = useState(null);
  const [simEvent, setSimEvent] = useState('payment.success');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Webhook Management</h2>
          <p className="text-sm text-slate-500">Kelola endpoint webhook untuk menerima notifikasi realtime dari transaksi.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
          <Plus size={18} /> Tambah Endpoint
        </button>
      </motion.div>


      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {[
          { id: 'endpoints', label: 'Endpoints', icon: Globe },
          { id: 'logs', label: 'Delivery Logs', icon: Clock },
          { id: 'events', label: 'Events', icon: Zap },
          { id: 'security', label: 'Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>


      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {webhooks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Webhook size={48} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-black">Belum ada webhook endpoint</h3>
              <p className="mt-2 text-sm text-slate-500">Tambahkan endpoint untuk menerima notifikasi transaksi secara realtime.</p>
              <button onClick={() => setShowAddModal(true)} className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">Tambah Endpoint</button>
            </div>
          ) : (
            webhooks.map((wh) => (
              <WebhookEndpointCard key={wh.id} webhook={wh} onDelete={() => deleteWebhook(wh.id)} onToggle={() => updateWebhook(wh.id, { status: wh.status === 'active' ? 'inactive' : 'active' })} onSimulate={() => { setShowSimulate(wh.id); setSimEvent('payment.success'); }} />
            ))
          )}
        </motion.div>
      )}


      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-4 font-medium text-slate-500">Status</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Event</th>
                  <th className="px-5 py-4 font-medium text-slate-500">URL</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Response</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Duration</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Waktu</th>
                  <th className="px-5 py-4 font-medium text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {webhookLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 transition hover:bg-blue-50/30">
                    <td className="px-5 py-3">
                      {log.statusCode >= 200 && log.statusCode < 300 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={12} /> {log.statusCode}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600"><XCircle size={12} /> {log.statusCode}</span>
                      )}
                    </td>
                    <td className="px-5 py-3"><span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs">{log.event}</span></td>
                    <td className="max-w-[200px] truncate px-5 py-3 text-xs text-slate-600">{log.url}</td>
                    <td className="max-w-[150px] truncate px-5 py-3 font-mono text-xs text-slate-500">{log.response}</td>
                    <td className="px-5 py-3 text-xs">{log.duration}ms</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{timeAgo(log.createdAt)}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => setShowLogDetail(log)} className="rounded-lg bg-blue-50 p-1.5 text-blue-600 transition hover:bg-blue-100"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}


      {/* Events Tab */}
      {activeTab === 'events' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-black">Available Events</h3>
          <p className="mb-6 text-sm text-slate-500">Daftar event yang bisa di-subscribe oleh webhook endpoint Anda.</p>
          <div className="grid gap-3 md:grid-cols-2">
            {availableEvents.map((ev) => (
              <div key={ev.id} className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-blue-600" />
                  <span className="font-mono text-sm font-bold">{ev.id}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{ev.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-black">Webhook Signature Verification</h3>
            <p className="mb-4 text-sm text-slate-500">Setiap webhook request dikirim dengan header signature untuk verifikasi keaslian.</p>
            <div className="rounded-xl bg-slate-900 p-5 text-sm">
              <pre className="overflow-x-auto text-green-400"><code>{`// Verifikasi webhook signature (Node.js)
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}

// Contoh penggunaan di Express.js
app.post('/webhook/matpay', (req, res) => {
  const signature = req.headers['x-matpay-signature'];
  const isValid = verifyWebhook(
    JSON.stringify(req.body),
    signature,
    'YOUR_WEBHOOK_SECRET'
  );
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Proses webhook event
  const { event, data } = req.body;
  console.log('Event:', event, 'Data:', data);
  
  res.status(200).json({ status: 'ok' });
});`}</code></pre>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-black">Retry Policy</h3>
            <p className="mb-4 text-sm text-slate-500">Jika endpoint gagal merespons, MatPay akan melakukan retry otomatis.</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-black text-blue-600">3x</p>
                <p className="mt-1 text-xs text-slate-500">Max Retry</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-black text-blue-600">30s</p>
                <p className="mt-1 text-xs text-slate-500">Interval Retry</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-black text-blue-600">5s</p>
                <p className="mt-1 text-xs text-slate-500">Timeout</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 text-amber-600" />
              <div>
                <h4 className="font-bold text-amber-800">Tips Keamanan</h4>
                <ul className="mt-2 space-y-1 text-sm text-amber-700/80">
                  <li>• Selalu verifikasi signature di setiap webhook request</li>
                  <li>• Gunakan HTTPS untuk endpoint webhook Anda</li>
                  <li>• Jangan expose webhook secret di client-side code</li>
                  <li>• Respond dengan status 200 dalam 5 detik</li>
                  <li>• Proses webhook secara asynchronous jika membutuhkan waktu lama</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}


      {/* Add Webhook Modal */}
      <AnimatePresence>
        {showAddModal && <AddWebhookModal onClose={() => setShowAddModal(false)} onAdd={addWebhook} />}
      </AnimatePresence>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {showLogDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowLogDetail(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="mb-4 text-lg font-black">Webhook Delivery Detail</h3>
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Event</p>
                  <p className="mt-1 font-mono text-sm font-bold">{showLogDetail.event}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">URL</p>
                  <p className="mt-1 break-all text-sm">{showLogDetail.url}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Status Code</p>
                  <p className={`mt-1 text-sm font-bold ${showLogDetail.statusCode < 300 ? 'text-emerald-600' : 'text-red-600'}`}>{showLogDetail.statusCode}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Request Payload</p>
                  <pre className="mt-1 overflow-x-auto text-xs text-slate-700">{JSON.stringify(JSON.parse(showLogDetail.payload), null, 2)}</pre>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Response</p>
                  <p className="mt-1 font-mono text-xs">{showLogDetail.response}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="mt-1 font-bold">{showLogDetail.duration}ms</p>
                </div>
              </div>
              <button onClick={() => setShowLogDetail(null)} className="mt-4 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700">Tutup</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulate Webhook Modal */}
      <AnimatePresence>
        {showSimulate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowSimulate(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="mb-4 text-lg font-black">Simulasi Webhook</h3>
              <p className="mb-4 text-sm text-slate-500">Kirim test event ke endpoint webhook untuk memastikan integrasi berjalan benar.</p>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium">Pilih Event</label>
                <select value={simEvent} onChange={(e) => setSimEvent(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
                  {availableEvents.map((ev) => (<option key={ev.id} value={ev.id}>{ev.id}</option>))}
                </select>
              </div>
              <button onClick={() => { simulateWebhook(showSimulate, simEvent); setShowSimulate(null); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white">
                <Send size={16} /> Kirim Test Event
              </button>
              <button onClick={() => setShowSimulate(null)} className="mt-2 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700">Batal</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


function WebhookEndpointCard({ webhook, onDelete, onToggle, onSimulate }) {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getStatusColor(webhook.status)}`}>{webhook.status}</span>
            <span className="text-xs text-slate-500">ID: {webhook.id}</span>
          </div>
          <p className="mt-2 break-all font-mono text-sm font-bold">{webhook.url}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {webhook.events.map((ev) => (
              <span key={ev} className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600">{ev}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onSimulate} className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100" title="Simulasi"><Play size={16} /></button>
          <button onClick={onToggle} className="rounded-lg bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100" title="Toggle">{webhook.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          <button onClick={onDelete} className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100" title="Hapus"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div>
          <span className="text-slate-400">Secret: </span>
          <span className="font-mono">{showSecret ? webhook.secret : '••••••••••••'}</span>
          <button onClick={() => setShowSecret(!showSecret)} className="ml-1 text-blue-600">{showSecret ? <EyeOff size={12} className="inline" /> : <Eye size={12} className="inline" />}</button>
          <button onClick={() => copyToClipboard(webhook.secret)} className="ml-1 text-blue-600"><Copy size={12} className="inline" /></button>
        </div>
        <span>Dibuat: {formatDate(webhook.createdAt)}</span>
        <span>Terakhir dipanggil: {timeAgo(webhook.lastTriggered)}</span>
      </div>
    </motion.div>
  );
}


function AddWebhookModal({ onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);

  const toggleEvent = (id) => {
    setSelectedEvents((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    if (!url || selectedEvents.length === 0) return;
    onAdd({ url, events: selectedEvents, status: 'active' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-black">Tambah Webhook Endpoint</h3>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Endpoint URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourdomain.com/webhook/matpay" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Subscribe Events</label>
            <div className="grid max-h-48 gap-2 overflow-y-auto">
              {availableEvents.map((ev) => (
                <label key={ev.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${selectedEvents.includes(ev.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}>
                  <input type="checkbox" checked={selectedEvents.includes(ev.id)} onChange={() => toggleEvent(ev.id)} className="h-4 w-4 rounded text-blue-600" />
                  <div>
                    <p className="font-mono text-xs font-bold">{ev.id}</p>
                    <p className="text-[11px] text-slate-500">{ev.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700">Batal</button>
          <button onClick={handleAdd} disabled={!url || selectedEvents.length === 0} className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50">Simpan</button>
        </div>
      </motion.div>
    </div>
  );
}
