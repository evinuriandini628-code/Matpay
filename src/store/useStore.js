import { create } from 'zustand';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../utils/firebase';
import { api } from '../utils/api';

export const useStore = create((set, get) => ({
  // Auth
  isAuthenticated: false,
  user: null,
  authLoading: true,

  setAuth: (user) => set({ isAuthenticated: !!user, user, authLoading: false }),

  login: async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userData = await api.getMe();
      set({ isAuthenticated: true, user: userData });
      return { success: true };
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Email atau password salah'
        : err.code === 'auth/user-not-found' ? 'Akun tidak ditemukan'
        : err.message;
      return { success: false, error: msg };
    }
  },

  register: async ({ name, email, password, phone }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Create Firestore profile
      const userData = await api.registerProfile({ name, phone });
      set({ isAuthenticated: true, user: userData });
      return { success: true };
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Email sudah terdaftar'
        : err.code === 'auth/weak-password' ? 'Password minimal 6 karakter'
        : err.message;
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ isAuthenticated: false, user: null, transactions: [], webhooks: [], webhookLogs: [] });
  },

  fetchUser: async () => {
    try {
      const userData = await api.getMe();
      set({ user: userData, isAuthenticated: true });
    } catch {
      set({ user: null });
    }
  },

  // Transactions
  transactions: [],
  fetchTransactions: async (params = '') => {
    try {
      const { transactions } = await api.getTransactions(params);
      set({ transactions });
    } catch (err) { console.error(err); }
  },

  addTransaction: async (data) => {
    try {
      const trx = await api.createTransaction(data);
      set((s) => ({ transactions: [trx, ...s.transactions] }));
      return trx;
    } catch (err) { console.error(err); }
  },

  updateTransactionStatus: async (id, status) => {
    try {
      const trx = await api.updateTransactionStatus(id, status);
      set((s) => ({ transactions: s.transactions.map((t) => (t.id === id ? trx : t)) }));
      get().fetchUser();
      return trx;
    } catch (err) { console.error(err); }
  },

  // Stats
  stats: { totalTransactions: 0, successCount: 0, totalVolume: 0, balance: 0, pendingBalance: 0 },
  fetchStats: async () => {
    try {
      const stats = await api.getStats();
      set({ stats });
    } catch (err) { console.error(err); }
  },

  // Webhooks
  webhooks: [],
  webhookLogs: [],

  fetchWebhooks: async () => {
    try {
      const webhooks = await api.getWebhooks();
      set({ webhooks });
    } catch (err) { console.error(err); }
  },

  addWebhook: async (data) => {
    try {
      const wh = await api.createWebhook(data);
      set((s) => ({ webhooks: [wh, ...s.webhooks] }));
    } catch (err) { console.error(err); }
  },

  updateWebhook: async (id, data) => {
    try {
      const wh = await api.updateWebhook(id, data);
      set((s) => ({ webhooks: s.webhooks.map((w) => (w.id === id ? wh : w)) }));
    } catch (err) { console.error(err); }
  },

  deleteWebhook: async (id) => {
    try {
      await api.deleteWebhook(id);
      set((s) => ({ webhooks: s.webhooks.filter((w) => w.id !== id) }));
    } catch (err) { console.error(err); }
  },

  simulateWebhook: async (id, event) => {
    try {
      const log = await api.simulateWebhook(id, event);
      set((s) => ({ webhookLogs: [log, ...s.webhookLogs] }));
      get().fetchWebhooks();
      return log;
    } catch (err) { console.error(err); }
  },

  fetchWebhookLogs: async () => {
    try {
      const logs = await api.getWebhookLogs();
      set({ webhookLogs: logs });
    } catch (err) { console.error(err); }
  },

  // API Keys
  apiKeys: null,
  fetchApiKeys: async () => {
    try {
      const keys = await api.getApiKeys();
      set({ apiKeys: keys });
    } catch (err) { console.error(err); }
  },

  regenerateKey: async (keyType) => {
    try {
      const keys = await api.regenerateKey(keyType);
      set({ apiKeys: keys });
    } catch (err) { console.error(err); }
  },

  // Notifications (local)
  notifications: [],
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}));
