import React, { useState } from 'react';
import { Search, Filter, Download, Eye, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatRupiah, formatDate, getStatusColor, getStatusLabel } from '../utils/helpers';

export default function Transactions() {
  const transactions = useStore((s) => s.transactions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedTrx, setSelectedTrx] = useState(null);

  const filtered = transactions.filter((t) => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchMethod = methodFilter === 'all' || t.method.toLowerCase().includes(methodFilter.toLowerCase());
    return matchSearch && matchStatus && matchMethod;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari order ID, customer, email..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="success">Berhasil</option>
            <option value="pending">Pending</option>
            <option value="failed">Gagal</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
          >
            <option value="all">Semua Metode</option>
            <option value="qris">QRIS</option>
            <option value="virtual account">Virtual Account</option>
            <option value="e-wallet">E-Wallet</option>
            <option value="credit card">Credit Card</option>
          </select>

          <button className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-600">
            <Download size={16} /> Export
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-4 font-medium text-slate-500">Order ID</th>
                <th className="px-5 py-4 font-medium text-slate-500">Customer</th>
                <th className="px-5 py-4 font-medium text-slate-500">Metode</th>
                <th className="px-5 py-4 font-medium text-slate-500">Jumlah</th>
                <th className="px-5 py-4 font-medium text-slate-500">Status</th>
                <th className="px-5 py-4 font-medium text-slate-500">Tanggal</th>
                <th className="px-5 py-4 font-medium text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trx) => (
                <tr key={trx.id} className="border-b border-slate-50 transition hover:bg-blue-50/30">
                  <td className="px-5 py-4 font-mono text-xs font-semibold">{trx.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{trx.customer}</p>
                    <p className="text-xs text-slate-500">{trx.email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{trx.method}</td>
                  <td className="px-5 py-4 font-bold">{formatRupiah(trx.amount)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getStatusColor(trx.status)}`}>
                      {getStatusLabel(trx.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{formatDate(trx.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedTrx(trx)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-slate-500">Tidak ada transaksi ditemukan</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-sm text-slate-500">
            Menampilkan {filtered.length} dari {transactions.length} transaksi
          </p>
        </div>
      </motion.div>

      {/* Detail Modal */}
      {selectedTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedTrx(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="mb-4 text-xl font-black">Detail Transaksi</h3>
            <div className="space-y-3">
              <InfoRow label="Order ID" value={selectedTrx.id} />
              <InfoRow label="Customer" value={selectedTrx.customer} />
              <InfoRow label="Email" value={selectedTrx.email} />
              <InfoRow label="Metode" value={selectedTrx.method} />
              <InfoRow label="Jumlah" value={formatRupiah(selectedTrx.amount)} />
              <InfoRow label="Status" value={getStatusLabel(selectedTrx.status)} />
              <InfoRow label="Dibuat" value={formatDate(selectedTrx.createdAt)} />
              <InfoRow label="Dibayar" value={selectedTrx.paidAt ? formatDate(selectedTrx.paidAt) : '-'} />
            </div>
            <button
              onClick={() => setSelectedTrx(null)}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700"
            >
              Tutup
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
