import React from 'react';
import { ReceiptText, Wallet, CheckCircle2, Clock3, TrendingUp, ArrowUpRight, QrCode, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStore } from '../store/useStore';
import { formatRupiah, getStatusColor, getStatusLabel, formatDate } from '../utils/helpers';

const chartData = [
  { name: 'Sen', amount: 4200000, count: 45 },
  { name: 'Sel', amount: 5800000, count: 62 },
  { name: 'Rab', amount: 3900000, count: 38 },
  { name: 'Kam', amount: 7200000, count: 78 },
  { name: 'Jum', amount: 6100000, count: 65 },
  { name: 'Sab', amount: 8400000, count: 92 },
  { name: 'Min', amount: 5600000, count: 58 },
];

const methodData = [
  { name: 'QRIS', value: 45 },
  { name: 'VA', value: 30 },
  { name: 'E-Wallet', value: 18 },
  { name: 'CC', value: 7 },
];

function StatCard({ title, value, sub, icon: Icon, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-black">{value}</h3>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const transactions = useStore((s) => s.transactions);
  const balance = useStore((s) => s.balance);
  const pendingBalance = useStore((s) => s.pendingBalance);

  const successCount = transactions.filter((t) => t.status === 'success').length;
  const totalVolume = transactions.filter((t) => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Transaksi" value={transactions.length.toLocaleString()} sub="Semua metode pembayaran" icon={ReceiptText} trend="+12.5%" delay={0} />
        <StatCard title="Total Volume" value={formatRupiah(totalVolume)} sub="Transaksi berhasil" icon={Wallet} trend="+8.2%" delay={0.05} />
        <StatCard title="Success Rate" value={`${((successCount / transactions.length) * 100).toFixed(1)}%`} sub={`${successCount} berhasil dari ${transactions.length}`} icon={CheckCircle2} delay={0.1} />
        <StatCard title="Pending Settlement" value={formatRupiah(pendingBalance)} sub="Cair dalam 24 jam" icon={Clock3} delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black">Volume Transaksi</h3>
              <p className="text-sm text-slate-500">7 hari terakhir</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1">
              <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">Mingguan</button>
              <button className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500">Bulanan</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip formatter={(v) => formatRupiah(v)} />
              <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-black">Metode Pembayaran</h3>
          <p className="mb-6 text-sm text-slate-500">Distribusi per metode</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={methodData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} unit="%" />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={60} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" fill="#2563eb" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <button
            onClick={() => navigate('/payment/qris')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
          >
            <QrCode size={16} /> Buat Payment Baru
          </button>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black">Transaksi Terbaru</h3>
          <button
            onClick={() => navigate('/transactions')}
            className="text-sm font-bold text-blue-600"
          >
            Lihat Semua →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Metode</th>
                <th className="pb-3 font-medium">Jumlah</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((trx) => (
                <tr key={trx.id} className="border-b border-slate-50">
                  <td className="py-3 font-mono text-xs font-semibold">{trx.id}</td>
                  <td className="py-3">{trx.customer}</td>
                  <td className="py-3 text-slate-600">{trx.method}</td>
                  <td className="py-3 font-bold">{formatRupiah(trx.amount)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getStatusColor(trx.status)}`}>
                      {getStatusLabel(trx.status)}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-slate-500">{formatDate(trx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
