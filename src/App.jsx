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
} from 'lucide-react'

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

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
        <Wallet className="h-6 w-6 text-white" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight text-white">MatPay</h1>
        <p className="text-xs text-slate-400">Smart Payment Gateway</p>
      </div>
    </div>
  )
}

function AuthPage({ mode, setMode, onLogin }) {
  const [showPass, setShowPass] = useState(false)
  const isLogin = mode === 'login'
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.20),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,.25),transparent_35%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-2">
        <div className="hidden flex-col justify-between p-10 lg:flex">
          <Logo />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <ShieldCheck className="h-4 w-4" /> Payment infrastructure for digital business
            </div>
            <h2 className="text-6xl font-black leading-tight tracking-tight">Terima QRIS, kelola saldo, dan settlement otomatis.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">Dashboard merchant modern dengan API key, webhook, invoice, QRIS payment page, withdraw, dan settlement 24 jam.</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {['QRIS All Payment', 'Webhook Realtime', 'Settlement 24 Jam'].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-400" />
                  <p className="text-sm font-semibold text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="text-sm text-slate-500">© 2026 MatPay Indonesia</p>
        </div>
        <div className="flex items-center justify-center p-5">
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between lg:hidden"><Logo /></div>
            <div className="mb-8">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
                {isLogin ? <LogIn className="h-7 w-7 text-cyan-300" /> : <UserPlus className="h-7 w-7 text-cyan-300" />}
              </div>
              <h2 className="text-3xl font-black">{isLogin ? 'Login Merchant' : 'Register Merchant'}</h2>
              <p className="mt-2 text-sm text-slate-400">{isLogin ? 'Masuk ke dashboard MatPay kamu.' : 'Buat akun merchant dan mulai terima pembayaran.'}</p>
            </div>
            <div className="space-y-4">
              {!isLogin && <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 outline-none transition focus:border-cyan-400" placeholder="Nama bisnis / toko" />}
              <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 outline-none transition focus:border-cyan-400" placeholder="Email merchant" />
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 pr-12 outline-none transition focus:border-cyan-400" placeholder="Password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
              {!isLogin && <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 outline-none transition focus:border-cyan-400" placeholder="Nomor WhatsApp" />}
              <button onClick={onLogin} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.01]">{isLogin ? 'Masuk Dashboard' : 'Buat Akun Merchant'}</button>
            </div>
            <p className="mt-6 text-center text-sm text-slate-400">{isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}<button onClick={() => setMode(isLogin ? 'register' : 'login')} className="font-bold text-cyan-300">{isLogin ? 'Register' : 'Login'}</button></p>
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
      <aside className={`fixed left-0 top-0 z-40 h-screen w-80 border-r border-white/10 bg-slate-950/95 p-5 text-white backdrop-blur-xl transition lg:sticky lg:block ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-8 flex items-center justify-between"><Logo /><button onClick={() => setOpen(false)} className="lg:hidden"><X /></button></div>
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon
            const selected = active === item.id
            return <button key={item.id} onClick={() => { setActive(item.id); setOpen(false) }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${selected ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 ring-1 ring-cyan-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon className="h-5 w-5" /><span className="font-semibold">{item.label}</span></button>
          })}
        </div>
        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-bold text-white">Need integration?</p>
          <p className="mt-1 text-xs text-slate-400">Hubungkan API MatPay ke website, bot, atau Minecraft store.</p>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-sm font-bold text-white">Docs API <ChevronRight className="h-4 w-4" /></button>
        </div>
      </aside>
    </>
  )
}

function Header({ setOpen }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white lg:hidden"><Menu /></button>
          <div><h2 className="text-xl font-black text-white">Merchant Dashboard</h2><p className="text-xs text-slate-400">Kelola transaksi dan settlement MatPay</p></div>
        </div>
        <div className="hidden flex-1 justify-center md:flex"><div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400"><Search className="h-4 w-4" /><span className="text-sm">Cari invoice, order id, transaksi...</span></div></div>
        <div className="flex items-center gap-3"><button className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white"><Bell className="h-5 w-5" /></button><div className="flex items-center gap-3 rounded-2xl bg-white/10 p-2 pr-4"><div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black">M</div><div className="hidden sm:block"><p className="text-sm font-bold text-white">Mat Store</p><p className="text-xs text-slate-400">Verified Merchant</p></div></div></div>
      </div>
    </header>
  )
}

function StatCard({ title, value, sub, icon: Icon }) {
  return <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10"><div className="mb-5 flex items-center justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon className="h-6 w-6" /></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">Live</span></div><p className="text-sm text-slate-400">{title}</p><h3 className="mt-1 text-3xl font-black text-white">{value}</h3><p className="mt-2 text-xs text-slate-500">{sub}</p></div>
}

function Overview() {
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard title="Saldo Aktif" value="Rp8.420.000" sub="Bisa digunakan untuk withdraw" icon={Wallet} /><StatCard title="Settlement Pending" value="Rp2.150.000" sub="Cair otomatis setelah 24 jam" icon={Clock3} /><StatCard title="Transaksi Hari Ini" value="128" sub="+18% dari kemarin" icon={ReceiptText} /><StatCard title="Success Rate" value="97.8%" sub="Webhook aktif dan stabil" icon={ShieldCheck} /></div><div className="grid gap-6 xl:grid-cols-3"><div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 xl:col-span-2"><div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-black text-white">Transaksi Terbaru</h3><button className="text-sm font-bold text-cyan-300">Lihat semua</button></div><div className="space-y-3">{transactions.map((trx) => <div key={trx.id} className="flex items-center justify-between rounded-2xl bg-slate-950/50 p-4"><div><p className="font-bold text-white">{trx.name}</p><p className="text-xs text-slate-500">{trx.id} • {trx.time}</p></div><div className="text-right"><p className="font-black text-white">{trx.amount}</p><span className={`text-xs font-bold ${trx.status === 'Success' ? 'text-emerald-300' : trx.status === 'Pending' ? 'text-amber-300' : 'text-rose-300'}`}>{trx.status}</span></div></div>)}</div></div><div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/15 to-violet-600/15 p-6"><QrCode className="mb-4 h-9 w-9 text-cyan-300" /><h3 className="text-xl font-black text-white">QRIS Universal</h3><p className="mt-2 text-sm leading-6 text-slate-300">Support pembayaran dari e-wallet dan mobile banking yang bisa scan QRIS.</p><div className="my-6 grid aspect-square place-items-center rounded-3xl bg-white p-5"><div className="grid h-full w-full place-items-center rounded-2xl border-4 border-slate-900 text-slate-900"><QrCode className="h-32 w-32" /></div></div><button className="w-full rounded-2xl bg-white px-4 py-3 font-black text-slate-950">Buat Payment Link</button></div></div></div>
}

function SimpleSection({ active }) {
  const map = { transactions: ['Manajemen Transaksi', 'Filter order id, status pending/success/failed, nominal, dan tanggal transaksi.'], payment: ['QRIS Payment Page', 'Generate invoice QRIS, expired time, auto check status, dan redirect setelah pembayaran.'], withdraw: ['Withdraw Saldo', 'Tarik saldo aktif ke rekening/e-wallet merchant dengan validasi admin atau otomatis.'], settlement: ['Settlement 24 Jam', 'Saldo transaksi masuk ke pending settlement, lalu cair otomatis setelah 24 jam.'], apikey: ['API Key & Webhook', 'Kelola secret key, callback URL, webhook signature, dan mode sandbox/production.'], settings: ['Pengaturan Merchant', 'Profil toko, logo, rekening payout, password, dan keamanan akun.'] }
  const [title, desc] = map[active] || map.transactions
  return <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"><div className="mb-6"><h3 className="text-2xl font-black text-white">{title}</h3><p className="mt-2 text-slate-400">{desc}</p></div>{active === 'apikey' ? <div className="space-y-4">{['Public Key', 'Secret Key', 'Webhook URL'].map((x, i) => <div key={x} className="flex items-center justify-between rounded-2xl bg-slate-950/60 p-4"><div><p className="text-sm text-slate-400">{x}</p><p className="mt-1 break-all font-mono text-sm text-white">{i === 2 ? 'https://domainkamu.com/matpay/callback' : `MP_${i === 0 ? 'PUB' : 'SEC'}_xxxxxxxxxxxxxxxx`}</p></div><Copy className="h-5 w-5 shrink-0 text-cyan-300" /></div>)}</div> : <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="rounded-3xl bg-slate-950/60 p-5"><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><ShieldCheck /></div><h4 className="font-black text-white">Feature Block {item}</h4><p className="mt-2 text-sm leading-6 text-slate-400">Komponen preview untuk halaman {title.toLowerCase()}.</p></div>)}</div>}</div>
}

function Dashboard() {
  const [active, setActive] = useState('overview')
  const [open, setOpen] = useState(false)
  return <div className="min-h-screen bg-slate-950 text-white"><div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,.12),transparent_35%)]" /><div className="relative lg:grid lg:grid-cols-[20rem_1fr]"><Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} /><main className="min-h-screen"><Header setOpen={setOpen} /><section className="p-4 lg:p-8">{active === 'overview' ? <Overview /> : <SimpleSection active={active} />}</section></main></div></div>
}

export default function App() {
  const [page, setPage] = useState('login')
  const [authMode, setAuthMode] = useState('login')
  if (page === 'dashboard') return <Dashboard />
  return <AuthPage mode={authMode} setMode={setAuthMode} onLogin={() => setPage('dashboard')} />
}
