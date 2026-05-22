import React from 'react';
import { Clock3, CheckCircle2, ReceiptText, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatRupiah } from '../utils/helpers';

const settlements = [
  { id: 'STL-001', amount: 5250000, trxCount: 48, date: '2024-05-06', status: 'completed' },
  { id: 'STL-002', amount: 3800000, trxCount: 35, date: '2024-05-05', status: 'completed' },
  { id: 'STL-003', amount: 8750000, trxCount: 72, date: '2024-05-07', status: 'pending' },
  { id: 'STL-004', amount: 4200000, trxCount: 41, date: '2024-05-04', status: 'completed' },
  { id: 'STL-005', amount: 6100000, trxCount: 55, date: '2024-05-03', status: 'completed' },
];

export default function Settlement() {
  const totalSettled = settlements.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0);
  const pendingAmount = settlements.filter((s) => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600"><Clock3 size={20} /></div>
          <p className="text-sm text-slate-500">Pending Settlement</p>
          <h3 className="mt-1 text-2xl font-black">{formatRupiah(pendingAmount)}</h3>
          <p className="mt-1 text-xs text-slate-400">Akan cair dalam 24 jam</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={20} /></div>
          <p className="text-sm text-slate-500">Total Settled</p>
          <h3 className="mt-1 text-2xl font-black">{formatRupiah(totalSettled)}</h3>
          <p className="mt-1 text-xs text-emerald-600 font-bold">Bulan ini</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><ReceiptText size={20} /></div>
          <p className="text-sm text-slate-500">Total Batch</p>
          <h3 className="mt-1 text-2xl font-black">{settlements.length}</h3>
          <p className="mt-1 text-xs text-slate-400">Riwayat settlement</p>
        </motion.div>
      </div>

      {/* Settlement List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-black">Riwayat Settlement</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead><tr className="border-b border-slate-100 text-slate-400">
              <th className="pb-3 font-medium">Batch ID</th>
              <th className="pb-3 font-medium">Jumlah</th>
              <th className="pb-3 font-medium">Transaksi</th>
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {settlements.map((s) => (
                <tr key={s.id} className="border-b border-slate-50">
                  <td className="py-4 font-mono text-xs font-semibold">{s.id}</td>
                  <td className="py-4 font-bold">{formatRupiah(s.amount)}</td>
                  <td className="py-4">{s.trxCount} transaksi</td>
                  <td className="py-4 text-xs text-slate-500">{s.date}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${s.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {s.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
                      {s.status === 'completed' ? 'Selesai' : 'Proses'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h4 className="mb-2 font-bold text-blue-700">Tentang Settlement</h4>
        <p className="text-sm text-blue-600/70">
          Settlement adalah proses transfer dana dari transaksi yang berhasil ke rekening bank Anda.
          MatPay melakukan settlement otomatis setiap hari kerja (H+1 untuk QRIS & VA, H+2 untuk Credit Card).
          Dana akan masuk ke rekening terdaftar dalam 1-3 jam setelah proses settlement dimulai.
        </p>
      </motion.div>
    </div>
  );
}
