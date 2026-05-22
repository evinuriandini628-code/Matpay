import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatRupiah, generateOrderId } from '../utils/helpers';

export default function PaymentCreditCard() {
  const addTransaction = useStore((s) => s.addTransaction);
  const [step, setStep] = useState('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState('');
  const [orderId, setOrderId] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const handleCreate = () => {
    if (!amount || !customer || !cardNumber || !expiry || !cvv || !cardName) return;
    const id = generateOrderId();
    setOrderId(id);
    setStep('processing');
    setTimeout(() => {
      addTransaction({
        id,
        method: 'Credit Card',
        amount: parseInt(amount),
        status: 'success',
        customer,
        email: customer.toLowerCase().replace(/\s/g, '') + '@email.com',
        paidAt: new Date().toISOString(),
      });
      setStep('success');
    }, 2000);
  };

  const handleReset = () => {
    setStep('form');
    setAmount('');
    setCustomer('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardName('');
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
              <h3 className="mb-2 text-xl font-black">Credit Card Payment</h3>
              <p className="mb-6 text-sm text-slate-500">
                Terima pembayaran menggunakan Visa, Mastercard, dan JCB.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Customer</label>
                  <input
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Nama customer"
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

                <hr className="my-4 border-slate-100" />

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-600" />
                    <span className="text-sm font-bold">Detail Kartu</span>
                    <Lock size={12} className="ml-auto text-slate-400" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">Nomor Kartu</label>
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4111 1111 1111 1111"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-slate-500">Nama di Kartu</label>
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="JOHN DOE"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm uppercase outline-none transition focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">Expired</label>
                        <input
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500">CVV</label>
                        <input
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          type="password"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!amount || !customer || !cardNumber || !expiry || !cvv || !cardName}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <Lock size={16} /> Bayar {amount ? formatRupiah(parseInt(amount)) : ''}
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-blue-50">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={36} className="text-blue-600" />
                </motion.div>
              </div>
              <h3 className="mb-2 text-xl font-black">Memproses Pembayaran...</h3>
              <p className="text-sm text-slate-500">Mohon tunggu, sedang memverifikasi kartu kredit Anda</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-50">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-emerald-600">Pembayaran Berhasil!</h3>
              <p className="mb-6 text-sm text-slate-500">Transaksi credit card telah dikonfirmasi</p>

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
                  <span className="text-sm text-slate-500">Kartu</span>
                  <span className="font-bold">**** {cardNumber.slice(-4)}</span>
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
            <h4 className="mb-3 font-bold">Info Credit Card</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Fee per transaksi</span>
                <span className="font-bold">2.9% + Rp2.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Min. transaksi</span>
                <span className="font-bold">Rp10.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maks. transaksi</span>
                <span className="font-bold">Rp100.000.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">3D Secure</span>
                <span className="font-bold text-emerald-600">Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement</span>
                <span className="font-bold">H+2</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <h4 className="font-bold text-emerald-700">Keamanan</h4>
            </div>
            <ul className="space-y-1.5 text-sm text-emerald-600/80">
              <li>• PCI DSS Level 1 Certified</li>
              <li>• 3D Secure Authentication</li>
              <li>• Tokenized Card Data</li>
              <li>• Fraud Detection System</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
