import React, { useState } from 'react';
import { QrCode, Copy, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatRupiah, generateOrderId } from '../utils/helpers';

export default function PaymentQris() {
  const addTransaction = useStore((s) => s.addTransaction);
  const [step, setStep] = useState('form'); // form, payment, success
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleCreate = () => {
    if (!amount || !customer) return;
    const id = generateOrderId();
    setOrderId(id);
    setStep('payment');
  };

  const handleSimulatePayment = () => {
    addTransaction({
      id: orderId,
      method: 'QRIS',
      amount: parseInt(amount),
      status: 'success',
      customer,
      email: customer.toLowerCase().replace(/\s/g, '') + '@email.com',
      paidAt: new Date().toISOString(),
    });
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    setAmount('');
    setCustomer('');
    setOrderId('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-[1fr_400px]"
      >
        {/* Main Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {step === 'form' && (
            <div>
              <h3 className="mb-6 text-xl font-black">Buat Payment QRIS</h3>
              <p className="mb-6 text-sm text-slate-500">
                Generate QR Code untuk menerima pembayaran dari customer.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Customer</label>
                  <input
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Masukkan nama customer"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Jumlah Pembayaran</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Masukkan nominal"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[50000, 100000, 250000, 500000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(String(v))}
                      className="rounded-xl border border-slate-200 py-2.5 text-xs font-bold transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {formatRupiah(v)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!amount || !customer}
                  className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Generate QRIS
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600">
                <Clock size={16} /> Menunggu Pembayaran • 04:59
              </div>

              <h3 className="mb-2 text-xl font-black">Scan QR untuk Membayar</h3>
              <p className="mb-6 text-sm text-slate-500">
                Gunakan aplikasi e-wallet atau mobile banking yang mendukung QRIS
              </p>

              {/* QR Code Placeholder */}
              <div className="mx-auto mb-6 grid h-64 w-64 place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                <div className="text-center">
                  <QrCode size={120} className="mx-auto text-[#06133a]" />
                  <p className="mt-3 text-xs font-bold text-slate-500">NMID: ID1023101234567</p>
                </div>
              </div>

              <div className="mx-auto max-w-sm space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Order ID</span>
                  <span className="font-mono text-sm font-bold">{orderId}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-lg font-black text-blue-600">{formatRupiah(parseInt(amount))}</span>
                </div>
              </div>

              <button
                onClick={handleSimulatePayment}
                className="mt-6 w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={16} className="mr-2 inline" />
                Simulasi Pembayaran Berhasil
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-50">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-emerald-600">Pembayaran Berhasil!</h3>
              <p className="mb-6 text-sm text-slate-500">Dana telah masuk ke saldo MatPay Anda</p>

              <div className="mx-auto max-w-sm space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Order ID</span>
                  <span className="font-mono text-sm font-bold">{orderId}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="font-bold">{formatRupiah(parseInt(amount))}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Metode</span>
                  <span className="font-bold">QRIS</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white"
              >
                <RefreshCw size={16} /> Buat Payment Baru
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar Info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-bold">Informasi QRIS</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Fee per transaksi</span>
                <span className="font-bold">0.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Min. transaksi</span>
                <span className="font-bold">Rp1.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maks. transaksi</span>
                <span className="font-bold">Rp10.000.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement</span>
                <span className="font-bold">H+1</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h4 className="mb-2 font-bold text-blue-700">Supported Apps</h4>
            <p className="text-sm text-blue-600/70">
              GoPay, OVO, DANA, ShopeePay, LinkAja, Mobile Banking (BCA, Mandiri, BNI, BRI), dan semua e-wallet yang mendukung QRIS.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
