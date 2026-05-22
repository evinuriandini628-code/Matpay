import React, { useState } from 'react';
import { Building2, Copy, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatRupiah, generateOrderId, copyToClipboard } from '../utils/helpers';

const banks = [
  { id: 'bca', name: 'BCA', code: '014', color: 'bg-blue-600' },
  { id: 'mandiri', name: 'Mandiri', code: '008', color: 'bg-yellow-500' },
  { id: 'bni', name: 'BNI', code: '009', color: 'bg-orange-500' },
  { id: 'bri', name: 'BRI', code: '002', color: 'bg-blue-800' },
  { id: 'permata', name: 'Permata', code: '013', color: 'bg-green-600' },
];

export default function PaymentVA() {
  const addTransaction = useStore((s) => s.addTransaction);
  const [step, setStep] = useState('form');
  const [selectedBank, setSelectedBank] = useState(null);
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState('');
  const [orderId, setOrderId] = useState('');
  const [vaNumber, setVaNumber] = useState('');

  const handleCreate = () => {
    if (!amount || !customer || !selectedBank) return;
    const id = generateOrderId();
    setOrderId(id);
    setVaNumber(`${selectedBank.code}${Math.floor(Math.random() * 9000000000000 + 1000000000000)}`);
    setStep('payment');
  };

  const handleSimulatePayment = () => {
    addTransaction({
      id: orderId,
      method: `Virtual Account ${selectedBank.name}`,
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
    setSelectedBank(null);
    setOrderId('');
    setVaNumber('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-[1fr_380px]"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {step === 'form' && (
            <div>
              <h3 className="mb-2 text-xl font-black">Virtual Account Payment</h3>
              <p className="mb-6 text-sm text-slate-500">
                Terima pembayaran via transfer bank dengan nomor Virtual Account otomatis.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Pilih Bank</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {banks.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank)}
                        className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-bold transition ${
                          selectedBank?.id === bank.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className={`h-3 w-3 rounded-full ${bank.color}`} />
                        {bank.name}
                      </button>
                    ))}
                  </div>
                </div>

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

                <button
                  onClick={handleCreate}
                  disabled={!amount || !customer || !selectedBank}
                  className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Generate Virtual Account
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600">
                <Clock size={16} /> Menunggu Pembayaran • Expired 24 jam
              </div>

              <h3 className="mb-2 text-xl font-black">Transfer ke Virtual Account</h3>
              <p className="mb-6 text-sm text-slate-500">
                Lakukan transfer ke nomor VA berikut melalui ATM, mobile banking, atau internet banking.
              </p>

              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Bank</p>
                  <p className="mt-1 flex items-center gap-2 font-bold">
                    <span className={`h-3 w-3 rounded-full ${selectedBank.color}`} />
                    {selectedBank.name}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-slate-500">Nomor Virtual Account</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-mono text-xl font-black text-blue-700">{vaNumber}</p>
                    <button
                      onClick={() => copyToClipboard(vaNumber)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Total Pembayaran</p>
                  <p className="mt-1 text-xl font-black">{formatRupiah(parseInt(amount))}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Order ID</p>
                  <p className="mt-1 font-mono font-bold">{orderId}</p>
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
              <p className="mb-6 text-sm text-slate-500">Transfer via VA {selectedBank?.name} telah dikonfirmasi</p>

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
                  <span className="text-sm text-slate-500">Bank</span>
                  <span className="font-bold">VA {selectedBank?.name}</span>
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

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-bold">Info Virtual Account</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Fee per transaksi</span>
                <span className="font-bold">Rp4.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Min. transaksi</span>
                <span className="font-bold">Rp10.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maks. transaksi</span>
                <span className="font-bold">Rp50.000.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expired</span>
                <span className="font-bold">24 Jam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement</span>
                <span className="font-bold">Realtime</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h4 className="mb-2 font-bold text-blue-700">Cara Bayar</h4>
            <ol className="space-y-2 text-sm text-blue-600/70">
              <li>1. Buka app mobile banking / ATM</li>
              <li>2. Pilih menu Transfer / Virtual Account</li>
              <li>3. Masukkan nomor VA yang tertera</li>
              <li>4. Konfirmasi nominal dan bayar</li>
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
