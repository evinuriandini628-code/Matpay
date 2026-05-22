import React, { useState } from 'react';
import { Banknote, CheckCircle2, Building2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatRupiah } from '../utils/helpers';

const withdrawHistory = [
  { id: 'WD-001', amount: 5000000, bank: 'BCA', account: '1234567890', status: 'success', date: '2024-05-05' },
  { id: 'WD-002', amount: 3500000, bank: 'Mandiri', account: '0987654321', status: 'success', date: '2024-05-03' },
  { id: 'WD-003', amount: 2000000, bank: 'BCA', account: '1234567890', status: 'pending', date: '2024-05-06' },
];

export default function Withdraw() {
  const balance = useStore((s) => s.balance);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-2">
        {/* Withdraw Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-black">Tarik Dana</h3>

          <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white">
            <p className="text-sm text-blue-100">Saldo Tersedia</p>
            <h2 className="mt-1 text-3xl font-black">{formatRupiah(balance)}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Nominal Penarikan</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masukkan nominal"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />
              <div className="mt-2 flex gap-2">
                {[1000000, 5000000, 10000000].map((v) => (
                  <button key={v} onClick={() => setAmount(String(v))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
                    {formatRupiah(v)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Catatan (opsional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan penarikan"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />
            </div>

            <button className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              <Banknote size={16} className="mr-2 inline" /> Tarik Dana
            </button>
          </div>
        </div>

        {/* Bank Account */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-4 font-bold">Rekening Tujuan</h4>
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"><Building2 size={18} /></div>
                <div>
                  <p className="font-black">Bank BCA</p>
                  <p className="text-sm text-slate-600">1234 5678 9012</p>
                  <p className="text-xs text-slate-500">a.n MatPay Store</p>
                </div>
              </div>
            </div>
            <button className="mt-3 text-sm font-bold text-blue-600">+ Tambah Rekening Lain</button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-bold">Info Withdraw</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Min. penarikan</span><span className="font-bold">Rp50.000</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Biaya admin</span><span className="font-bold">Rp6.500</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Estimasi proses</span><span className="font-bold">1-3 jam</span></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-black">Riwayat Penarikan</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead><tr className="border-b border-slate-100 text-slate-400">
              <th className="pb-3 font-medium">ID</th><th className="pb-3 font-medium">Jumlah</th><th className="pb-3 font-medium">Bank</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Tanggal</th>
            </tr></thead>
            <tbody>
              {withdrawHistory.map((w) => (
                <tr key={w.id} className="border-b border-slate-50">
                  <td className="py-3 font-mono text-xs font-semibold">{w.id}</td>
                  <td className="py-3 font-bold">{formatRupiah(w.amount)}</td>
                  <td className="py-3">{w.bank} • {w.account}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${w.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {w.status === 'success' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {w.status === 'success' ? 'Berhasil' : 'Proses'}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-slate-500">{w.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
