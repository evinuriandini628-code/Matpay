import { create } from 'zustand';

const generateId = () => 'TRX-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

const initialTransactions = [
  { id: 'INV-240506-001', method: 'QRIS', amount: 150000, status: 'success', customer: 'John Doe', email: 'john@email.com', createdAt: '2024-05-06T10:30:00', paidAt: '2024-05-06T10:31:00' },
  { id: 'INV-240506-002', method: 'Virtual Account BCA', amount: 89000, status: 'pending', customer: 'Jane Smith', email: 'jane@email.com', createdAt: '2024-05-06T11:00:00', paidAt: null },
  { id: 'INV-240506-003', method: 'E-Wallet GoPay', amount: 200000, status: 'failed', customer: 'Bob Wilson', email: 'bob@email.com', createdAt: '2024-05-06T11:30:00', paidAt: null },
  { id: 'INV-240506-004', method: 'QRIS', amount: 75000, status: 'success', customer: 'Alice Brown', email: 'alice@email.com', createdAt: '2024-05-06T12:00:00', paidAt: '2024-05-06T12:01:00' },
  { id: 'INV-240506-005', method: 'Credit Card', amount: 500000, status: 'success', customer: 'Charlie Davis', email: 'charlie@email.com', createdAt: '2024-05-06T12:30:00', paidAt: '2024-05-06T12:32:00' },
  { id: 'INV-240506-006', method: 'Virtual Account Mandiri', amount: 320000, status: 'success', customer: 'Diana Evans', email: 'diana@email.com', createdAt: '2024-05-06T13:00:00', paidAt: '2024-05-06T13:05:00' },
  { id: 'INV-240506-007', method: 'E-Wallet OVO', amount: 45000, status: 'pending', customer: 'Edward Fisher', email: 'edward@email.com', createdAt: '2024-05-06T13:30:00', paidAt: null },
  { id: 'INV-240506-008', method: 'QRIS', amount: 180000, status: 'success', customer: 'Fiona Garcia', email: 'fiona@email.com', createdAt: '2024-05-06T14:00:00', paidAt: '2024-05-06T14:01:00' },
  { id: 'INV-240506-009', method: 'Virtual Account BNI', amount: 750000, status: 'success', customer: 'George Harris', email: 'george@email.com', createdAt: '2024-05-06T14:30:00', paidAt: '2024-05-06T14:35:00' },
  { id: 'INV-240506-010', method: 'E-Wallet DANA', amount: 95000, status: 'expired', customer: 'Hannah Irving', email: 'hannah@email.com', createdAt: '2024-05-06T15:00:00', paidAt: null },
];

const initialWebhooks = [
  { id: 'wh-001', url: 'https://mystore.com/api/matpay/callback', events: ['payment.success', 'payment.failed', 'payment.expired'], status: 'active', secret: 'whsec_matpay_abc123xyz', createdAt: '2024-04-01T10:00:00', lastTriggered: '2024-05-06T14:35:00' },
  { id: 'wh-002', url: 'https://app.example.id/webhook/payment', events: ['payment.success'], status: 'active', secret: 'whsec_matpay_def456uvw', createdAt: '2024-04-15T09:00:00', lastTriggered: '2024-05-06T12:32:00' },
  { id: 'wh-003', url: 'https://staging.myapp.dev/notify', events: ['payment.success', 'payment.failed', 'refund.success'], status: 'inactive', secret: 'whsec_matpay_ghi789rst', createdAt: '2024-05-01T14:00:00', lastTriggered: null },
];

const initialWebhookLogs = [
  { id: 'log-001', webhookId: 'wh-001', event: 'payment.success', url: 'https://mystore.com/api/matpay/callback', statusCode: 200, response: '{"status":"ok"}', payload: '{"event":"payment.success","data":{"id":"INV-240506-009","amount":750000}}', createdAt: '2024-05-06T14:35:00', duration: 234 },
  { id: 'log-002', webhookId: 'wh-002', event: 'payment.success', url: 'https://app.example.id/webhook/payment', statusCode: 200, response: '{"received":true}', payload: '{"event":"payment.success","data":{"id":"INV-240506-008","amount":180000}}', createdAt: '2024-05-06T14:01:00', duration: 156 },
  { id: 'log-003', webhookId: 'wh-001', event: 'payment.failed', url: 'https://mystore.com/api/matpay/callback', statusCode: 500, response: 'Internal Server Error', payload: '{"event":"payment.failed","data":{"id":"INV-240506-003","amount":200000}}', createdAt: '2024-05-06T11:30:00', duration: 5023 },
  { id: 'log-004', webhookId: 'wh-001', event: 'payment.success', url: 'https://mystore.com/api/matpay/callback', statusCode: 200, response: '{"status":"ok"}', payload: '{"event":"payment.success","data":{"id":"INV-240506-006","amount":320000}}', createdAt: '2024-05-06T13:05:00', duration: 198 },
  { id: 'log-005', webhookId: 'wh-002', event: 'payment.success', url: 'https://app.example.id/webhook/payment', statusCode: 200, response: '{"received":true}', payload: '{"event":"payment.success","data":{"id":"INV-240506-005","amount":500000}}', createdAt: '2024-05-06T12:32:00', duration: 312 },
  { id: 'log-006', webhookId: 'wh-001', event: 'payment.expired', url: 'https://mystore.com/api/matpay/callback', statusCode: 200, response: '{"status":"ok"}', payload: '{"event":"payment.expired","data":{"id":"INV-240506-010","amount":95000}}', createdAt: '2024-05-06T15:00:00', duration: 187 },
];

const initialNotifications = [
  { id: 'notif-001', title: 'Pembayaran Berhasil', message: 'INV-240506-009 - Rp750.000 via VA BNI', type: 'success', read: false, createdAt: '2024-05-06T14:35:00' },
  { id: 'notif-002', title: 'Pembayaran Gagal', message: 'INV-240506-003 - Rp200.000 via E-Wallet GoPay', type: 'error', read: false, createdAt: '2024-05-06T11:30:00' },
  { id: 'notif-003', title: 'Webhook Gagal', message: 'Endpoint mystore.com mengembalikan status 500', type: 'warning', read: true, createdAt: '2024-05-06T11:30:00' },
  { id: 'notif-004', title: 'Settlement Selesai', message: 'Rp5.250.000 telah ditransfer ke rekening', type: 'info', read: true, createdAt: '2024-05-05T09:00:00' },
];

export const useStore = create((set, get) => ({
  // Auth
  isAuthenticated: false,
  user: { name: 'MatPay Store', email: 'merchant@matpay.id', phone: '0812-3456-7890', role: 'Merchant' },
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  // Balance
  balance: 12450000,
  pendingBalance: 8750000,

  // Transactions
  transactions: initialTransactions,
  addTransaction: (trx) => set((state) => ({ transactions: [{ id: generateId(), ...trx, createdAt: new Date().toISOString() }, ...state.transactions] })),

  // Webhooks
  webhooks: initialWebhooks,
  webhookLogs: initialWebhookLogs,
  addWebhook: (webhook) => set((state) => ({
    webhooks: [{ id: 'wh-' + Date.now().toString(36), secret: 'whsec_matpay_' + Math.random().toString(36).slice(2, 14), createdAt: new Date().toISOString(), lastTriggered: null, ...webhook }, ...state.webhooks]
  })),
  updateWebhook: (id, data) => set((state) => ({
    webhooks: state.webhooks.map((w) => w.id === id ? { ...w, ...data } : w)
  })),
  deleteWebhook: (id) => set((state) => ({
    webhooks: state.webhooks.filter((w) => w.id !== id)
  })),
  simulateWebhook: (webhookId, event) => {
    const webhook = get().webhooks.find((w) => w.id === webhookId);
    if (!webhook) return;
    const log = {
      id: 'log-' + Date.now().toString(36),
      webhookId,
      event,
      url: webhook.url,
      statusCode: Math.random() > 0.2 ? 200 : 500,
      response: Math.random() > 0.2 ? '{"status":"ok"}' : 'Internal Server Error',
      payload: JSON.stringify({ event, data: { id: generateId(), amount: Math.floor(Math.random() * 500000) + 50000, timestamp: new Date().toISOString() } }),
      createdAt: new Date().toISOString(),
      duration: Math.floor(Math.random() * 2000) + 100,
    };
    set((state) => ({
      webhookLogs: [log, ...state.webhookLogs],
      webhooks: state.webhooks.map((w) => w.id === webhookId ? { ...w, lastTriggered: log.createdAt } : w),
    }));
    return log;
  },

  // Notifications
  notifications: initialNotifications,
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),

  // API Keys
  apiKeys: {
    publicKey: 'MP_PUB_live_' + Math.random().toString(36).slice(2, 14),
    secretKey: 'MP_SEC_live_' + Math.random().toString(36).slice(2, 14),
    sandboxPublicKey: 'MP_PUB_sandbox_' + Math.random().toString(36).slice(2, 14),
    sandboxSecretKey: 'MP_SEC_sandbox_' + Math.random().toString(36).slice(2, 14),
  },
  regenerateKey: (keyType) => set((state) => ({
    apiKeys: { ...state.apiKeys, [keyType]: state.apiKeys[keyType].split('_').slice(0, -1).join('_') + '_' + Math.random().toString(36).slice(2, 14) }
  })),

  // Payment Channels
  paymentChannels: {
    qris: { enabled: true, fee: 0.7 },
    va_bca: { enabled: true, fee: 4000 },
    va_mandiri: { enabled: true, fee: 4000 },
    va_bni: { enabled: true, fee: 4000 },
    va_bri: { enabled: true, fee: 4000 },
    va_permata: { enabled: false, fee: 4000 },
    ewallet_gopay: { enabled: true, fee: 2 },
    ewallet_ovo: { enabled: true, fee: 2 },
    ewallet_dana: { enabled: true, fee: 1.5 },
    ewallet_shopeepay: { enabled: true, fee: 1.5 },
    credit_card: { enabled: true, fee: 2.9 },
  },
  toggleChannel: (channel) => set((state) => ({
    paymentChannels: { ...state.paymentChannels, [channel]: { ...state.paymentChannels[channel], enabled: !state.paymentChannels[channel].enabled } }
  })),
}));
