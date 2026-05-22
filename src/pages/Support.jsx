import React, { useState } from 'react';
import { Headphones, MessageCircle, Mail, Phone, Send, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Support() {
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Chat */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100">
                <Headphones size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold">MatPay Support</h3>
                <p className="flex items-center gap-1 text-xs text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Online</p>
              </div>
            </div>
          </div>

          <div className="h-[400px] space-y-4 overflow-y-auto p-5">
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">CS</div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3 text-sm">
                <p>Halo! Selamat datang di MatPay Support. Ada yang bisa kami bantu?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">CS</div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3 text-sm">
                <p>Kami siap membantu Anda untuk integrasi API, webhook configuration, settlement, atau masalah transaksi lainnya.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />
              <button className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-4 font-bold">Hubungi Kami</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <MessageCircle size={18} className="text-green-600" />
                <div><p className="text-xs text-slate-500">WhatsApp</p><p className="font-bold">0812-3456-7890</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Mail size={18} className="text-blue-600" />
                <div><p className="text-xs text-slate-500">Email</p><p className="font-bold">support@matpay.id</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Phone size={18} className="text-purple-600" />
                <div><p className="text-xs text-slate-500">Telepon</p><p className="font-bold">021-5555-1234</p></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-3 font-bold">Dokumentasi</h4>
            <div className="space-y-2">
              {['API Reference', 'Webhook Guide', 'SDK Documentation', 'FAQ'].map((doc) => (
                <button key={doc} className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-3 text-sm font-medium transition hover:bg-blue-50 hover:text-blue-600">
                  <span className="flex items-center gap-2"><FileText size={14} /> {doc}</span>
                  <ExternalLink size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white">
            <h4 className="font-bold">Jam Operasional</h4>
            <p className="mt-2 text-sm text-blue-100">Live Chat: 24/7</p>
            <p className="text-sm text-blue-100">Telepon: Sen-Jum 09:00-18:00</p>
            <p className="text-sm text-blue-100">Email: Response 1x24 jam</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
