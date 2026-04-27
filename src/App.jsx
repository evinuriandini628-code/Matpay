import React, { useState } from "react";
import {
  LayoutDashboard, ReceiptText, QrCode, Wallet, Banknote, Clock3,
  KeyRound, Settings, Headphones, Menu, X, Bell, Search, Eye, EyeOff,
  LogIn, UserPlus, Copy, ShieldCheck, CheckCircle2, AlertCircle,
  Loader2, Plus, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const assets = {
  logoIcon: "/assets/logo/logo-icon.png",
  logoFullWhite: "/assets/logo/logo-full-white.png",

  mascotLogin: "/assets/mascot/maskot-login.png",
  mascotQris: "/assets/mascot/maskot-qris.png",
  mascotLoading: "/assets/mascot/maskot-loading.png",
  mascotSuccess: "/assets/mascot/maskot-success.png",
  mascotFailed: "/assets/mascot/maskot-failed.png",
  mascotCs: "/assets/mascot/maskot-cs.png",
  mascotAvatar: "/assets/mascot/maskot-avatar.png",
  mascotEmpty: "/assets/mascot/maskot-empty.png",
};

const menus = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transaksi", icon: ReceiptText },
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "withdraw", label: "Withdraw", icon: Banknote },
  { id: "settlement", label: "Settlement", icon: Clock3 },
  { id: "apikey", label: "API Key", icon: KeyRound },
  { id: "support", label: "Support", icon: Headphones },
  { id: "settings", label: "Settings", icon: Settings },
];

const trx = [
  ["INV-240506-001", "QRIS Payment", "Rp150.000", "Berhasil"],
  ["INV-240506-002", "QRIS Payment", "Rp89.000", "Pending"],
  ["INV-240506-003", "QRIS Payment", "Rp200.000", "Gagal"],
  ["INV-240506-004", "QRIS Payment", "Rp75.000", "Berhasil"],
];

function Img({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (err) return null;
  return <img src={src} alt={alt} onError={() => setErr(true)} className={className} />;
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Img src={assets.logoIcon} alt="MatPay" className="h-10 w-10 rounded-xl object-contain" />
      <Img src={assets.logoFullWhite} alt="MatPay" className="h-9 max-w-[145px] object-contain object-left" />
      <div className="hidden">
        <b>MatPay</b>
      </div>
    </div>
  );
}

function Mascot({ type, className = "" }) {
  const map = {
    login: assets.mascotLogin,
    qris: assets.mascotQris,
    loading: assets.mascotLoading,
    success: assets.mascotSuccess,
    failed: assets.mascotFailed,
    cs: assets.mascotCs,
    avatar: assets.mascotAvatar,
    empty: assets.mascotEmpty,
  };

  return (
    <Img
      src={map[type]}
      alt={`maskot-${type}`}
      className={`object-contain drop-shadow-2xl ${className}`}
    />
  );
}

function Auth({ mode, setMode, onLogin }) {
  const [show, setShow] = useState(false);
  const login = mode === "login";

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#06133a]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0057ff] to-[#0aa7ff] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Logo />

          <div className="relative z-10">
            <h1 className="max-w-xl text-5xl font-black leading-tight">
              Solusi Pembayaran Digital untuk Bisnis Anda
            </h1>
            <p className="mt-5 max-w-md text-blue-50/80">
              Terima QRIS, kelola transaksi, withdraw, settlement, dan webhook dalam satu dashboard.
            </p>

            <div className="mt-10 h-[420px]">
              <Mascot type="login" className="h-full" />
            </div>
          </div>

          <p className="text-sm text-blue-50/70">© 2026 MatPay Indonesia</p>
        </section>

        <section className="flex items-center justify-center p-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-[28px] border border-blue-100 bg-white p-7 shadow-xl"
          >
            <div className="mb-7 flex justify-center lg:hidden">
              <Mascot type="login" className="h-40" />
            </div>

            <div className="mb-7">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                {login ? <LogIn /> : <UserPlus />}
              </div>
              <h2 className="text-3xl font-black">
                {login ? "Masuk ke MatPay" : "Daftar Akun MatPay"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {login ? "Silakan masuk untuk melanjutkan." : "Buat akun merchant baru."}
              </p>
            </div>

            <div className="space-y-4">
              {!login && <Input placeholder="Nama bisnis" />}
              <Input placeholder="Email merchant" />

              <div className="relative">
                <Input type={show ? "text" : "password"} placeholder="Password" />
                <button
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!login && <Input placeholder="Nomor WhatsApp" />}

              <button
                onClick={onLogin}
                className="w-full rounded-2xl bg-[#0057ff] py-4 font-bold text-white shadow-lg shadow-blue-500/25"
              >
                {login ? "Masuk" : "Daftar Sekarang"}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              {login ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                onClick={() => setMode(login ? "register" : "login")}
                className="font-bold text-blue-600"
              >
                {login ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-blue-500"
    />
  );
}

function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${open ? "block" : "hidden"}`}
      />

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 bg-[#06133a] p-5 text-white transition lg:sticky ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X />
          </button>
        </div>

        <nav className="space-y-2">
          {menus.map((m) => {
            const Icon = m.icon;
            const selected = active === m.id;

            return (
              <button
                key={m.id}
                onClick={() => {
                  setActive(m.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  selected
                    ? "bg-[#0057ff] text-white"
                    : "text-blue-100/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {m.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/10 p-4">
          <p className="text-xs text-blue-100/60">Saldo tersedia</p>
          <h3 className="mt-1 text-xl font-black">Rp12.450.000</h3>
          <button className="mt-4 w-full rounded-xl bg-blue-500 py-3 text-sm font-bold">
            Tarik Dana
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ setOpen }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 lg:hidden"
        >
          <Menu />
        </button>

        <div>
          <h2 className="text-xl font-black text-[#06133a]">Dashboard</h2>
          <p className="text-sm text-slate-500">Selamat datang kembali, Merchant!</p>
        </div>

        <div className="ml-auto hidden max-w-md flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-400 md:flex">
          <Search size={18} />
          <span className="text-sm">Cari transaksi, invoice, order ID...</span>
        </div>

        <button className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 pr-4">
          <Mascot type="avatar" className="h-9 w-9 rounded-full" />
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-[#06133a]">MatPay Store</p>
            <p className="text-xs text-slate-500">Merchant</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Transaksi" value="1.250" sub="+12.5% dari kemarin" icon={ReceiptText} />
        <Stat title="Total Volume" value="Rp125.400.000" sub="+8.2% dari kemarin" icon={Wallet} />
        <Stat title="Berhasil" value="1.180" sub="94.4%" icon={CheckCircle2} good />
        <Stat title="Pending Settlement" value="Rp8.750.000" sub="Akan cair dalam 24 jam" icon={Clock3} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card title="Transaksi Terbaru">
          <TransactionList compact />
        </Card>

        <Card title="Quick Action QRIS">
          <div className="rounded-3xl bg-blue-50 p-5">
            <QrCode className="mb-4 text-blue-600" size={36} />
            <h3 className="text-lg font-black">Buat Payment QRIS</h3>
            <p className="mt-2 text-sm text-slate-500">
              Generate invoice dan QRIS untuk pembayaran customer.
            </p>
            <button className="mt-5 w-full rounded-2xl bg-blue-600 py-3 font-bold text-white">
              Buat Payment
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ title, value, sub, icon: Icon, good }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon />
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-black text-[#06133a]">{value}</h3>
      <p className={good ? "mt-2 text-xs font-bold text-emerald-600" : "mt-2 text-xs text-slate-400"}>
        {sub}
      </p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xl font-black text-[#06133a]">{title}</h3>
      {children}
    </section>
  );
}

function TransactionList({ empty = false }) {
  if (empty) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="py-3">Order ID</th>
            <th>Metode</th>
            <th>Jumlah</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trx.map(([id, method, amount, status]) => (
            <tr key={id} className="border-t border-slate-100">
              <td className="py-4 font-semibold">{id}</td>
              <td>{method}</td>
              <td className="font-bold">{amount}</td>
              <td>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    status === "Berhasil"
                      ? "bg-emerald-50 text-emerald-600"
                      : status === "Pending"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-3xl bg-blue-50/60 p-10 text-center">
      <Mascot type="empty" className="h-56" />
      <h3 className="mt-4 text-2xl font-black text-[#06133a]">Belum ada data</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Data belum tersedia. Mulai buat payment pertama kamu.
      </p>
      <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white">
        <Plus size={18} /> Buat Payment
      </button>
    </div>
  );
}

function QrisPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card title="QRIS Payment Page">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-[#06133a]">Scan QR untuk membayar</h2>
            <p className="mt-3 text-slate-500">
              Gunakan aplikasi e-wallet atau mobile banking yang mendukung QRIS.
            </p>

            <div className="mt-8 space-y-4">
              <Info label="Order ID" value="INV-20240516-002" />
              <Info label="Total Pembayaran" value="Rp250.000" />
              <Info label="Expired" value="04:59" />
            </div>
          </div>

          <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white p-6">
            <QrCode size={190} className="text-[#06133a]" />
            <p className="mt-4 font-bold">NMID: ID1023101234567</p>
          </div>
        </div>
      </Card>

      <section className="rounded-3xl bg-blue-50 p-6">
        <Mascot type="qris" className="h-[360px] w-full" />
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-black text-[#06133a]">{value}</p>
    </div>
  );
}

function ProcessingPage() {
  return <PaymentState type="loading" title="Memproses Pembayaran..." icon={<Loader2 className="animate-spin text-blue-600" />} />;
}

function SuccessPage() {
  return <PaymentState type="success" title="Pembayaran Berhasil!" success />;
}

function FailedPage() {
  return <PaymentState type="failed" title="Pembayaran Gagal" failed />;
}

function PaymentState({ type, title, icon, success, failed }) {
  return (
    <div className={`grid gap-6 rounded-3xl p-8 lg:grid-cols-2 ${failed ? "bg-red-50" : success ? "bg-emerald-50" : "bg-blue-50"}`}>
      <div className="grid place-items-center">
        <Mascot type={type} className="h-[420px]" />
      </div>

      <div className="flex items-center">
        <div className="w-full rounded-3xl bg-white p-7 shadow-sm">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-slate-50">
            {icon || (success ? <CheckCircle2 className="text-emerald-600" /> : <AlertCircle className="text-red-600" />)}
          </div>
          <h2 className={`text-3xl font-black ${failed ? "text-red-600" : success ? "text-emerald-600" : "text-[#06133a]"}`}>
            {title}
          </h2>
          <p className="mt-2 text-slate-500">
            {failed ? "Pembayaran tidak dapat diproses." : success ? "Dana berhasil diterima." : "Mohon tunggu sebentar."}
          </p>

          <div className="mt-6 space-y-3">
            <Info label="Order ID" value="INV-20240516-002" />
            <Info label="Total Pembayaran" value="Rp250.000" />
            <Info label="Metode" value="QRIS" />
          </div>

          <button className={`mt-6 w-full rounded-2xl py-4 font-bold text-white ${failed ? "bg-red-600" : "bg-blue-600"}`}>
            {failed ? "Coba Lagi" : "Kembali ke Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WithdrawPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Withdraw / Tarik Dana">
        <div className="space-y-4">
          <Info label="Saldo tersedia" value="Rp25.750.000" />
          <Input placeholder="Nominal penarikan" />
          <Input placeholder="Catatan penarikan" />
          <button className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white">
            Tarik Dana
          </button>
        </div>
      </Card>

      <Card title="Rekening Tujuan">
        <div className="rounded-3xl border border-slate-200 p-5">
          <p className="font-black">BCA</p>
          <p className="mt-2 text-sm text-slate-500">1234 5678 9012</p>
          <p className="text-sm text-slate-500">a.n MatPay Store</p>
        </div>
      </Card>
    </div>
  );
}

function SettlementPage() {
  return (
    <Card title="Settlement">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat title="Pending" value="Rp8.750.000" sub="Dalam proses" icon={Clock3} />
        <Stat title="Berhasil" value="Rp30.250.000" sub="Bulan ini" icon={CheckCircle2} good />
        <Stat title="Total Batch" value="35" sub="Riwayat settlement" icon={ReceiptText} />
      </div>
    </Card>
  );
}

function ApiKeyPage() {
  return (
    <Card title="API Key & Webhook">
      {["Public Key", "Secret Key", "Webhook URL"].map((x, i) => (
        <div key={x} className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-500">{x}</p>
            <p className="mt-1 break-all font-mono text-sm font-bold">
              {i === 2 ? "https://domainkamu.com/matpay/callback" : `MP_${i === 0 ? "PUB" : "SEC"}_xxxxxxxxxxxx`}
            </p>
          </div>
          <Copy className="text-blue-600" />
        </div>
      ))}
    </Card>
  );
}

function SupportPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-3xl bg-blue-50 p-6">
        <Mascot type="cs" className="h-80 w-full" />
      </section>

      <Card title="Customer Support">
        <p className="text-slate-500">
          Tim MatPay siap bantu kamu untuk integrasi, pembayaran, webhook, dan settlement.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Info label="Live Chat" value="Online 24 Jam" />
          <Info label="Email" value="support@matpay.id" />
          <Info label="WhatsApp" value="0812-3456-7890" />
        </div>

        <button className="mt-6 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white">
          Mulai Chat
        </button>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return (
    <Card title="Pengaturan Profil">
      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <Input placeholder="Nama Merchant" defaultValue="MatPay Store" />
          <Input placeholder="Email" defaultValue="merchant@matpay.id" />
          <Input placeholder="Nomor Telepon" defaultValue="0812 3456 7890" />
          <button className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white">
            Simpan Perubahan
          </button>
        </div>

        <div className="grid place-items-center rounded-3xl bg-blue-50 p-6 text-center">
          <Mascot type="avatar" className="h-36 rounded-full" />
          <button className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-600">
            Ubah Foto
          </button>
        </div>
      </div>
    </Card>
  );
}

function AppDashboard() {
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);

  const pages = {
    dashboard: <DashboardPage />,
    transactions: <Card title="Transaksi"><TransactionList /></Card>,
    qris: <QrisPage />,
    withdraw: <WithdrawPage />,
    settlement: <SettlementPage />,
    apikey: <ApiKeyPage />,
    support: <SupportPage />,
    settings: <SettingsPage />,
    processing: <ProcessingPage />,
    success: <SuccessPage />,
    failed: <FailedPage />,
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#06133a] lg:grid lg:grid-cols-[288px_1fr]">
      <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />

      <section>
        <Header setOpen={setOpen} />

        <div className="p-5 lg:p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            {["processing", "success", "failed"].map((x) => (
              <button
                key={x}
                onClick={() => setActive(x)}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-sm"
              >
                Preview {x}
              </button>
            ))}
          </div>

          {pages[active]}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState("auth");
  const [mode, setMode] = useState("login");

  if (page === "dashboard") return <AppDashboard />;

  return <Auth mode={mode} setMode={setMode} onLogin={() => setPage("dashboard")} />;
}
