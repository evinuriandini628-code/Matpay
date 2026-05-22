import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function Settings() {
  const user = useStore((s) => s.user);
  const paymentChannels = useStore((s) => s.paymentChannels);
  const toggleChannel = useStore((s) => s.toggleChannel);
  const [activeTab, setActiveTab] = useState('profile');

  const channelLabels = {
    qris: { name: 'QRIS', desc: 'Pembayaran via QR Code' },
    va_bca: { name: 'VA BCA', desc: 'Virtual Account Bank BCA' },
    va_mandiri: { name: 'VA Mandiri', desc: 'Virtual Account Bank Mandiri' },
    va_bni: { name: 'VA BNI', desc: 'Virtual Account Bank BNI' },
    va_bri: { name: 'VA BRI', desc: 'Virtual Account Bank BRI' },
    va_permata: { name: 'VA Permata', desc: 'Virtual Account Bank Permata' },
    ewallet_gopay: { name: 'GoPay', desc: 'E-Wallet GoPay' },
    ewallet_ovo: { name: 'OVO', desc: 'E-Wallet OVO' },
    ewallet_dana: { name: 'DANA', desc: 'E-Wallet DANA' },
    ewallet_shopeepay: { name: 'ShopeePay', desc: 'E-Wallet ShopeePay' },
    credit_card: { name: 'Credit Card', desc: 'Visa, Mastercard, JCB' },
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {[
          { id: 'profile', label: 'Profil', icon: User },
          { id: 'channels', label: 'Payment Channels', icon: Globe },
          { id: 'notifications', label: 'Notifikasi', icon: Bell },
          { id: 'security', label: 'Keamanan', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
              <Icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>


      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black">Profil Merchant</h3>
          <div className="grid gap-6 md:grid-cols-[1fr_200px]">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Merchant</label>
                <input defaultValue={user.name} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input defaultValue={user.email} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nomor Telepon</label>
                <input defaultValue={user.phone} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Alamat Bisnis</label>
                <textarea rows={3} placeholder="Alamat lengkap bisnis Anda" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
              </div>
              <button className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700">
                Simpan Perubahan
              </button>
            </div>
            <div className="text-center">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-black text-white">
                M
              </div>
              <button className="mt-3 text-sm font-bold text-blue-600">Ubah Foto</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Channels Tab */}
      {activeTab === 'channels' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-black">Payment Channels</h3>
          <p className="mb-6 text-sm text-slate-500">Aktifkan atau nonaktifkan metode pembayaran yang tersedia untuk customer Anda.</p>
          <div className="space-y-3">
            {Object.entries(paymentChannels).map(([key, channel]) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-blue-200">
                <div>
                  <p className="font-bold">{channelLabels[key]?.name || key}</p>
                  <p className="text-xs text-slate-500">{channelLabels[key]?.desc} • Fee: {typeof channel.fee === 'number' && channel.fee < 100 ? `${channel.fee}%` : `Rp${channel.fee?.toLocaleString?.() || channel.fee}`}</p>
                </div>
                <button onClick={() => toggleChannel(key)} className={`transition ${channel.enabled ? 'text-blue-600' : 'text-slate-300'}`}>
                  {channel.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black">Pengaturan Notifikasi</h3>
          <div className="space-y-4">
            {[
              { label: 'Email notifikasi transaksi', desc: 'Terima email setiap ada transaksi masuk', enabled: true },
              { label: 'Push notification', desc: 'Notifikasi realtime di browser', enabled: true },
              { label: 'WhatsApp notification', desc: 'Terima notif via WhatsApp', enabled: false },
              { label: 'Webhook failure alert', desc: 'Notif ketika webhook gagal', enabled: true },
              { label: 'Settlement notification', desc: 'Notif ketika settlement selesai', enabled: true },
              { label: 'Daily report', desc: 'Laporan harian via email', enabled: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button className={item.enabled ? 'text-blue-600' : 'text-slate-300'}>
                  {item.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-black">Keamanan Akun</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password Lama</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password Baru</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
              </div>
              <button className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Ubah Password</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <div>
                  <p className="font-bold text-emerald-700">2FA Aktif</p>
                  <p className="text-xs text-emerald-600/70">Menggunakan Google Authenticator</p>
                </div>
              </div>
              <button className="text-sm font-bold text-emerald-600">Kelola</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
