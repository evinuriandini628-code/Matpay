import React, { useState } from 'react';
import { Smartphone, CheckCircle2, RefreshCw, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatRupiah, generateOrderId } from '../utils/helpers';

const wallets = [
  { id: 'gopay', name: 'GoPay', fee: '2%', color: 'bg-green-500' },
  { id: 'ovo', name: 'OVO', fee: '2%', color: 'bg-purple-600' },
  { id: 'dana', name: 'DANA', fee: '1.5%', color: 'bg-blue-500' },
  { id: 'shopeepay', name: 'ShopeePay', fee: '1.5%', color: 'bg-orange-500' },
  { id: 'linkaja', name: 'LinkAja', fee: '1.5%', color: 'bg-red-500' },
];

export default function PaymentEWallet() {
  const addTransaction = useStore((s) => s.addTransaction);
  const [step, setStep] = useState('form');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleCreate = () => {
    if (!amount || !customer || !selectedWallet || !phone) return;
    const id = generateOrderId();
    setOrderId(id);
    setStep('payment');
  };

  const handleSimulatePayment = () => {
    addTransaction({
      id: orderId,
      method: `E-Wallet ${selectedWallet.name}`,
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
    setPhone('');
    setSelectedWallet(null);
    setOrderId('');
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
              <h3 className="mb-2 text-xl font-black">E-Wallet Payment</h3>
              <p className="mb-6 text-sm text-slate-500">
                Terima pembayaran melalui dompet digital (GoPay, OVO, DANA, dll).
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Pilih E-Wallet</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {wallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => setSelectedWallet(wallet)}
                        className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-bold transition ${
                          selectedWallet?.id === wallet.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className={`h-3 w-3 rounded-full ${wallet.color}`} />
                        {wallet.name}
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
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nomor HP</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
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
                  disabled={!amount || !customer || !selectedWallet || !phone}
                  className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Kirim Request Pembayaran
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600">
                <Clock size={16} /> Menunggu Konfirmasi • 05:00
              </div>

              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-blue-50">
                <Smartphone size={36} className="text-blue-600" />
              </div>

              <h3 className="mb-2 text-xl font-black">Menunggu Pembayaran</h3>
              <p className="mb-6 text-sm text-slate-500">
                Notifikasi pembayaran telah dikirim ke {selectedWallet?.name} ({phone}).
                Silakan konfirmasi pembayaran di aplikasi {selectedWallet?.name}.
              </p>

              <div className="mx-auto max-w-sm space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Order ID</span>
                  <span className="font-mono text-sm font-bold">{orderId}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">E-Wallet</span>
                  <span className="font-bold">{selectedWallet?.name}</span>
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
              <p className="mb-6 text-sm text-slate-500">Pembayaran via {selectedWallet?.name} telah dikonfirmasi</p>

              <div className="mx-auto max-w-sm space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Order ID</span>
                  <span className="font-mono text-sm font-bold">{orderId}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="font-bold">{formatRupiah(parseInt(amount))}</span>
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

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-bold">Info E-Wallet</h4>
            <div className="space-y-3 text-sm">
              {wallets.map((w) => (
                <div key={w.id} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className={`h-2 w-2 rounded-full ${w.color}`} />
                    {w.name}
                  </span>
                  <span className="font-bold">Fee {w.fee}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-bold">Fitur</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Real-time notification</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Auto-detect user wallet</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Webhook callback</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Settlement H+1</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
