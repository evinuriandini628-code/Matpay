import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Wallet,
  ReceiptText,
  QrCode,
  KeyRound,
  Banknote,
  Clock3,
  Settings,
  Menu,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
  Search,
  ChevronRight,
  UserPlus,
  LogIn,
  Copy,
  CheckCircle2,
  Sparkles,
  UploadCloud,
} from 'lucide-react'

const assets = {
  logoIcon: '/assets/logo/logo-icon.png',
  logoFullWhite: '/assets/logo/logo-full-white.png',
  logoText: '/assets/logo/logo-text.png',
  mascotLogin: '/assets/mascot/maskot-login.png',
  mascotQris: '/assets/mascot/maskot-qris.png',
  mascotSuccess: '/assets/mascot/maskot-success.png',
  mascotFailed: '/assets/mascot/maskot-failed.png',
  mascotLoading: '/assets/mascot/maskot-loading.png',
  mascotAvatar: '/assets/mascot/maskot-avatar.png',
}

const menu = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transaksi', icon: ReceiptText },
  { id: 'payment', label: 'QRIS Payment', icon: QrCode },
  { id: 'withdraw', label: 'Withdraw', icon: Banknote },
  { id: 'settlement', label: 'Settlement', icon: Clock3 },
  { id: 'apikey', label: 'API Key', icon: KeyRound },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const transactions = [
  { id: 'MP-2401', name: 'Topup Diamond MLBB', amount: 'Rp25.000', status: 'Success', time: '2 menit lalu' },
  { id: 'MP-2402', name: 'Pembelian Rank VIP', amount: 'Rp50.000', status: 'Pending', time: '9 menit lalu' },
  { id: 'MP-2403', name: 'QRIS Checkout', amount: 'Rp120.000', status: 'Success', time: '21 menit lalu' },
  { id: 'MP-2404', name: 'Invoice PPOB', amount: 'Rp15.000', status: 'Failed', time: '34 menit lalu' },
]

function AssetImage({ src, alt, className, fallback }) {
  const [error, setError] = useState(false)
  if (error) return fallback || null
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />
}

function IconFallback({ className = 'h-11 w-11' }) {
  return (
    <div className={`${className} relative grid place-items-center rounded-2xl bg-gradient-to-br from-[#1076ff] via-[#0457d8] to-[#062b86] shadow-lg shadow-blue-500/25`}>
      <Wallet className="h-6 w-6 text-white" />
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-[#050b1f]" />
    </div>
  )
}

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <AssetImage src={assets.logoIcon} alt="MatPay logo icon" className="h-11 w-11 rounded-2xl object-contain shadow-lg shadow-blue-500/20" fallback={<IconFallback />} />
      {!compact && (
        <div className="min-w-0">
          <AssetImage src={assets.logoFullWhite} alt="MatPay" className="h-10 max-w-[160px] object-contain object-left" fallback={<><h1 className="text-xl font-black tracking-tight text-white">MatPay</h1><p className="text-xs text-blue-200/70">Smart Payment Gateway</p></>} />
        </div>
      )}
    </div>
  )
}

function MascotSlot({ type = 'login', className = '' }) {
  const src = type === 'qris' ? assets.mascotQris : type === 'success' ? assets.mascotSuccess : type === 'failed' ? assets.mascotFailed : type === 'loading' ? assets.mascotLoading : assets.mascotLogin
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-x-10 bottom-3 h-14 rounded-full bg-blue-500/30 blur-2xl" />
      <AssetImage
        src={src}
        alt={`MatPay mascot ${type}`}
        className="relative z-10 mx-auto max-h-full max-w-full object-contain drop-shadow-2xl"
        fallback={<div className="relative z-10 grid aspect-square w-full place-items-center rounded-[2rem] border border-blue-300/20 bg-blue-500/10 text-blue-100"><UploadCloud className="h-12 w-12" /><span className="absolute bottom-6 text-xs font-bold text-blue-100/70">Upload {src}</span></div>}
      />
    </div>
  )
}

function AuthPage({ mode, setMode, onLogin }) {
  const [showPass, setShowPass] = useState(false)
  const isLogin = mode === 'login'
  return (
    <div className="min-h-screen overflow-hidden bg-[#050b1f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,118,255,.30),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,210,255,.18),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.04)_0,transparent_35%,rgba(255,255,255,.02)_100%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
        <div className="hidden flex-col justify-between p-10 lg:flex">
          <Logo />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid max-w-6xl grid-cols-[1fr_.85fr] items-center gap-8">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-100">
                <ShieldCheck className="h-4 w-4" /> MatPay merchant infrastructure
              </div>
              <h2 className="text-6xl font-black leading-tight tracking-tight">Terima QRIS, kelola saldo, dan settlement otomatis.</h2>
              <p className="mt-6 text-lg leading-8 text-blue-100/75">Dashboard merchant modern dengan API key, webhook, invoice, QRIS payment page, withdraw, dan settlement 24 jam.</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {['QRIS All Payment', 'Webhook Realtime', 'Settlement 24 Jam'].map((item) => (
                  <div key={item} className="rounded-3xl border border-blue-200/10 bg-white/[0.06] p-4 backdrop-blur">
                    <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-400" />
                    <p className="text-sm font-semibold text-blue-50">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2.5rem] border border-blue-200/10 bg-gradient-to-br from-white/10 to-blue-500/10 p-5 shadow-2xl shadow-blue-950/40">
              <MascotSlot type={isLogin ? 'login' : 'success'} className="h-[430px]" />
            </div>
          </motion.div>
          <p className="text-sm text-blue-100/45">© 2026 MatPay Indonesia</p>
        </div>
        <div className="flex items-center justify-center p-5">
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-[2rem] border border-blue-100/10 bg-white/[0.08] p-6 shadow-2xl shadow-blue-950/50 backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between lg:hidden"><Logo /></div>
            <div className="mb-6 lg:hidden"><MascotSlot type={isLogin ? 'login' : 'success'} className="h-44" /></div>
            <div className="mb-8">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/15 text-blue-200 ring-1 ring-blue-200/10">
                {isLogin ? <LogIn className="h-7 w-7" /> : <UserPlus className="h-7 w-7" />}
              </div>
              <h2 className="text-3xl font-black">{isLogin ? 'Login Merchant' : 'Register Merchant'}</h2>
              <p className="mt-2 text-sm text-blue-100/60">{isLogin ? 'Masuk ke dashboard MatPay kamu.' : 'Buat akun merchant dan mulai terima pembayaran.'}</p>
            </div>
            <div className="space-y-4">
              {!isLogin && <input className="w-full rounded-2xl border border-blue-100/10 bg-[#06112e]/70 px-4 py-4 outline-none transition placeholder:text-blue-100/35 focus:border-[#24b7ff]" placeholder="Nama bisnis / toko" />}
              <input className="w-full rounded-2xl border border-blue-100/10 bg-[#06112e]/70 px-4 py-4 outline-none transition placeholder:text-blue-100/35 focus:border-[#24b7ff]" placeholder="Email merchant" />
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="w-full rounded-2xl border border-blue-100/10 bg-[#06112e]/70 px-4 py-4 pr-12 outline-none transition placeholder:text-blue-100/35 focus:border-[#24b7ff]" placeholder="Password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-100/50">{showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
              {!isLogin && <input className="w-full rounded-2xl border border-blue-100/10 bg-[#06112e]/70 px-4 py-4 outline-none transition placeholder:text-blue-100/35 focus:border-[#24b7ff]" placeholder="Nomor WhatsApp" />}
              <button onClick={onLogin} className="w-full rounded-2xl bg-gradient-to-r from-[#0a73ff] via-[#0062ff] to-[#00b9ff] px-5 py-4 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]">{isLogin ? 'Masuk Dashboard' : 'Buat Akun Merchant'}</button>
            </div>
            <p className="mt-6 text-center text-sm text-blue-100/60">{isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}<button onClick={() => setMode(isLogin ? 'register' : 'login')} className="font-bold text-[#5fd4ff]">{isLogin ? 'Register' : 'Login'}</button></p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden ${open ? 'block' : 'hidden'}`} />
      <aside className={`fixed left-0 top-0 z-40 h-screen w-80 border-r border-blue-100/10 bg-[#050b1f]/95 p-5 text-white backdrop-blur-xl transition lg:sticky lg:block ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-8 flex items-center justify-between"><Logo /><button onClick={() => setOpen(false)} className="lg:hidden"><X /></button></div>
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon
            const selected = active === item.id
            return <button key={item.id} onClick={() => { setActive(item.id); setOpen(false) }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${selected ? 'bg-gradient-to-r from-[#0a73ff]/25 to-[#00b9ff]/15 text-blue-50 ring-1 ring-blue-300/20' : 'text-blue-100/50 hover:bg-white/5 hover:text-white'}`}><Icon className="h-5 w-5" /><span className="font-semibold">{item.label}</span></button>
          })}
        </div>
        <div className="absolute bottom-5 left-5 right-5 overflow-hidden rounded-3xl border border-blue-100/10 bg-gradient-to-br from-blue-500/15 to-white/5 p-4">
          <Sparkles className="mb-3 h-5 w-5 text-[#5fd4ff]" />
          <p className="text-sm font-bold text-white">Need integration?</p>
          <p className="mt-1 text-xs text-blue-100/55">Hubungkan API MatPay ke website, bot, atau Minecraft store.</p>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-sm font-bold text-white">Docs API <ChevronRight className="h-4 w-4" /></button>
        </div>
      </aside>
    </>
  )
}

function Header({ setOpen }) {
  return (
    <header className="sticky top-0 z-20 border-b border-blue-100/10 bg-[#050b1f]/75 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white lg:hidden"><Menu /></button>
          <div><h2 className="text-xl font-black text-white">Merchant Dashboard</h2><p className="text-xs text-blue-100/50">Kelola transaksi dan settlement MatPay</p></div>
        </div>
        <div className="hidden flex-1 justify-center md:flex"><div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-blue-100/10 bg-white/5 px-4 py-3 text-blue-100/50"><Search className="h-4 w-4" /><span className="text-sm">Cari invoice, order id, transaksi...</span></div></div>
        <div className="flex items-center gap-3"><button className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white"><Bell className="h-5 w-5" /></button><div className="flex items-center gap-3 rounded-2xl bg-white/10 p-2 pr-4"><AssetImage src={assets.mascotAvatar} alt="Merchant avatar" className="h-9 w-9 rounded-xl object-cover" fallback={<div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#0a73ff] to-[#00b9ff] font-black">M</div>} /><div className="hidden sm:block"><p className="text-sm font-bold text-white">Mat Store</p><p className="text-xs text-blue-100/50">Verified Merchant</p></div></div></div>
      </div>
    </header>
  )
}

function StatCard({ title, value, sub, icon: Icon }) {
  return <div className="rounded-[1.7rem] border border-blue-100/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10"><div className="mb-5 flex items-center justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-[#5fd4ff]"><Icon className="h-6 w-6" /></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">Live</span></div><p className="text-sm text-blue-100/55">{title}</p><h3 className="mt-1 text-3xl font-black text-white">{value}</h3><p className="mt-2 text-xs text-blue-100/35">{sub}</p></div>
}

function Overview() {
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Saldo Aktif" value="Rp8.420.000" sub="Bisa digunakan untuk withdraw" icon={Wallet} /><StatCard title="Settlement Pending" value="Rp2.150.000" sub="Cair otomatis setelah 24 jam" icon={Clock3} /><StatCard title="Transaksi Hari Ini" value="128" sub="+18% dari kemarin" icon={ReceiptText} /><StatCard title="Success Rate" value="97.8%" sub="Webhook aktif dan stabil" icon={ShieldCheck} /></div><div className="grid gap-6 xl:grid-cols-3"><div className="rounded-[2rem] border border-blue-100/10 bg-white/[0.06] p-6 xl:col-span-2"><div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-black text-white">Transaksi Terbaru</h3><button className="text-sm font-bold text-[#5fd4ff]">Lihat semua</button></div><div className="space-y-3">{transactions.map((trx) => <div key={trx.id} className="flex items-center justify-between rounded-2xl bg-[#06112e]/70 p-4"><div><p className="font-bold text-white">{trx.name}</p><p className="text-xs text-blue-100/35">{trx.id} • {trx.time}</p></div><div className="text-right"><p className="font-black text-white">{trx.amount}</p><span className={`text-xs font-bold ${trx.status === 'Success' ? 'text-emerald-300' : trx.status === 'Pending' ? 'text-amber-300' : 'text-rose-300'}`}>{trx.status}</span></div></div>)}</div></div><div className="overflow-hidden rounded-[2rem] border border-blue-100/10 bg-gradient-to-br from-blue-500/15 via-white/[0.06] to-cyan-400/10 p-6"><h3 className="text-xl font-black text-white">QRIS Universal</h3><p className="mt-2 text-sm leading-6 text-blue-100/65">Support pembayaran dari e-wallet dan mobile banking yang bisa scan QRIS.</p><MascotSlot type="qris" className="my-3 h-64" /><button className="w-full rounded-2xl bg-white px-4 py-3 font-black text-[#062b86]">Buat Payment Link</button></div></div></div>
}

function SimpleSection({ active }) {
  const map = { transactions: ['Manajemen Transaksi', 'Filter order id, status pending/success/failed, nominal, dan tanggal transaksi.'], payment: ['QRIS Payment Page', 'Generate invoice QRIS, expired time, auto check status, dan redirect setelah pembayaran.'], withdraw: ['Withdraw Saldo', 'Tarik saldo aktif ke rekening/e-wallet merchant dengan validasi admin atau otomatis.'], settlement: ['Settlement 24 Jam', 'Saldo transaksi masuk ke pending settlement, lalu cair otomatis setelah 24 jam.'], apikey: ['API Key & Webhook', 'Kelola secret key, callback URL, webhook signature, dan mode sandbox/production.'], settings: ['Pengaturan Merchant', 'Profil toko, logo, rekening payout, password, dan keamanan akun.'] }
  const [title, desc] = map[active] || map.transactions
  const mascotType = active === 'payment' ? 'qris' : active === 'settlement' ? 'loading' : active === 'withdraw' ? 'success' : active === 'transactions' ? 'success' : 'login'
  return <div className="grid gap-6 xl:grid-cols-[1fr_360px]"><div className="rounded-[2rem] border border-blue-100/10 bg-white/[0.06] p-6"><div className="mb-6"><h3 className="text-2xl font-black text-white">{title}</h3><p className="mt-2 text-blue-100/60">{desc}</p></div>{active === 'apikey' ? <div className="space-y-4">{['Public Key', 'Secret Key', 'Webhook URL'].map((x, i) => <div key={x} className="flex items-center justify-between rounded-2xl bg-[#06112e]/70 p-4"><div><p className="text-sm text-blue-100/45">{x}</p><p className="mt-1 break-all font-mono text-sm text-white">{i === 2 ? 'https://domainkamu.com/matpay/callback' : `MP_${i === 0 ? 'PUB' : 'SEC'}_xxxxxxxxxxxxxxxx`}</p></div><Copy className="h-5 w-5 shrink-0 text-[#5fd4ff]" /></div>)}</div> : <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="rounded-3xl bg-[#06112e]/70 p-5"><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-[#5fd4ff]"><ShieldCheck /></div><h4 className="font-black text-white">Feature Block {item}</h4><p className="mt-2 text-sm leading-6 text-blue-100/50">Komponen preview untuk halaman {title.toLowerCase()}.</p></div>)}</div>}</div><div className="rounded-[2rem] border border-blue-100/10 bg-gradient-to-br from-blue-500/15 to-cyan-400/10 p-5"><MascotSlot type={mascotType} className="h-80" /><p className="mt-3 text-center text-sm font-semibold text-blue-100/60">Asset slot: {mascotType}</p></div></div>
}

function Dashboard() {
  const [active, setActive] = useState('overview')
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-[#050b1f] text-white"><div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,118,255,.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,185,255,.12),transparent_35%)]" /><div className="relative lg:grid lg:grid-cols-[20rem_1fr]"><Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} /><main className="min-h-screen"><Header setOpen={setOpen} /><section className="p-4 lg:p-8">{active === 'overview' ? <Overview /> : <SimpleSection active={active} />}</section></main></div></div>
}

export default function App() {
  const [page, setPage] = useState('login')
  const [authMode, setAuthMode] = useState('login')
  if (page === 'dashboard') return <Dashboard />
  return <AuthPage mode={authMode} setMode={setAuthMode} onLogin={() => setPage('dashboard')} />
}
