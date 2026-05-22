import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ReceiptText, QrCode, Wallet, Banknote, Clock3,
  KeyRound, Settings, Headphones, Menu, X, Bell, Search, LogOut,
  Webhook, CreditCard, Building2, Smartphone, ChevronDown, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatRupiah } from '../utils/helpers';

const menuGroups = [
  {
    label: 'Menu Utama',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/transactions', label: 'Transaksi', icon: ReceiptText },
    ]
  },
  {
    label: 'Payment Gateway',
    items: [
      { path: '/payment/qris', label: 'QRIS', icon: QrCode },
      { path: '/payment/virtual-account', label: 'Virtual Account', icon: Building2 },
      { path: '/payment/e-wallet', label: 'E-Wallet', icon: Smartphone },
      { path: '/payment/credit-card', label: 'Credit Card', icon: CreditCard },
    ]
  },
  {
    label: 'Keuangan',
    items: [
      { path: '/withdraw', label: 'Withdraw', icon: Banknote },
      { path: '/settlement', label: 'Settlement', icon: Clock3 },
    ]
  },
  {
    label: 'Developer',
    items: [
      { path: '/webhooks', label: 'Webhook', icon: Webhook },
      { path: '/api-keys', label: 'API Keys', icon: KeyRound },
    ]
  },
  {
    label: 'Lainnya',
    items: [
      { path: '/support', label: 'Support', icon: Headphones },
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  },
];

function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const balance = useStore((s) => s.balance);
  const logout = useStore((s) => s.logout);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${open ? 'block' : 'hidden'}`}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col bg-[#06133a] text-white transition-transform lg:sticky ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black">MatPay</h1>
              <p className="text-[10px] text-blue-300/60">Payment Gateway</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-blue-300/40">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
                        }`
                      }
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Balance Card */}
        <div className="m-3 rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-600/20 p-4 backdrop-blur">
          <p className="text-xs text-blue-200/60">Saldo Tersedia</p>
          <h3 className="mt-1 text-xl font-black">{formatRupiah(balance)}</h3>
          <button
            onClick={() => { navigate('/withdraw'); setOpen(false); }}
            className="mt-3 w-full rounded-xl bg-blue-500 py-2.5 text-sm font-bold transition hover:bg-blue-400"
          >
            Tarik Dana
          </button>
        </div>

        {/* Logout */}
        <div className="border-t border-white/5 p-3">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300/80 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ setOpen }) {
  const [showNotif, setShowNotif] = useState(false);
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllRead);
  const user = useStore((s) => s.user);
  const location = useLocation();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('transactions')) return 'Transaksi';
    if (path.includes('qris')) return 'QRIS Payment';
    if (path.includes('virtual-account')) return 'Virtual Account';
    if (path.includes('e-wallet')) return 'E-Wallet';
    if (path.includes('credit-card')) return 'Credit Card';
    if (path.includes('withdraw')) return 'Withdraw';
    if (path.includes('settlement')) return 'Settlement';
    if (path.includes('webhooks')) return 'Webhook Management';
    if (path.includes('api-keys')) return 'API Keys';
    if (path.includes('support')) return 'Support';
    if (path.includes('settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-lg font-black text-[#06133a]">{getPageTitle()}</h2>
            <p className="text-xs text-slate-500">Selamat datang, {user.name}!</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-400 md:flex">
            <Search size={16} />
            <input
              placeholder="Cari transaksi..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-bold text-[#06133a]">Notifikasi</h4>
                    <button onClick={markAllRead} className="text-xs text-blue-600">
                      Tandai semua dibaca
                    </button>
                  </div>
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-xl p-3 text-sm ${n.read ? 'bg-slate-50' : 'bg-blue-50'}`}
                      >
                        <p className="font-semibold text-[#06133a]">{n.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 pr-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
              M
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-[#06133a]">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#06133a] lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <section className="flex flex-col">
        <Header setOpen={setSidebarOpen} />
        <div className="flex-1 p-5 lg:p-8">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
