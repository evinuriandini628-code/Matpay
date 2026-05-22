import React, { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useStore((s) => s.login);
  const register = useStore((s) => s.register);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register({ name, email, password, phone });
    }
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#06133a]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left - Branding */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0057ff] to-[#0aa7ff] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black">MatPay</h1>
              <p className="text-[10px] text-blue-100/60">Payment Gateway</p>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="max-w-xl text-5xl font-black leading-tight">
              Solusi Pembayaran Digital untuk Bisnis Anda
            </h1>
            <p className="mt-5 max-w-md text-blue-50/80">
              Terima QRIS, Virtual Account, E-Wallet, Credit Card, kelola transaksi, webhook, dan settlement dalam satu dashboard.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: 'QRIS', desc: 'Semua e-wallet & mbanking' },
                { label: 'Virtual Account', desc: 'BCA, Mandiri, BNI, BRI' },
                { label: 'E-Wallet', desc: 'GoPay, OVO, DANA, ShopeePay' },
                { label: 'Webhook', desc: 'Realtime notification' },
              ].map((f) => (
                <div key={f.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="font-bold">{f.label}</p>
                  <p className="mt-1 text-xs text-blue-100/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-blue-50/50">© 2026 MatPay Indonesia</p>
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute -top-10 right-20 h-48 w-48 rounded-full bg-white/5" />
        </section>

        {/* Right - Form */}
        <section className="flex items-center justify-center p-5">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[28px] border border-blue-100 bg-white p-7 shadow-xl">
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black">MatPay</span>
            </div>

            <div className="mb-7">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                {isLogin ? <LogIn size={22} /> : <UserPlus size={22} />}
              </div>
              <h2 className="text-3xl font-black">{isLogin ? 'Masuk ke MatPay' : 'Daftar Akun MatPay'}</h2>
              <p className="mt-2 text-sm text-slate-500">{isLogin ? 'Silakan masuk untuk melanjutkan.' : 'Buat akun merchant baru.'}</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama bisnis" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-blue-500" />
              )}
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email merchant" type="email" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-blue-500" />
              <div className="relative">
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Password" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-blue-500" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && (
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nomor WhatsApp" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-blue-500" />
              )}

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#0057ff] py-4 font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <button onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); }} className="font-bold text-blue-600">
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
