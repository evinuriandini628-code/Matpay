import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function getToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

async function request(endpoint, options = {}) {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth (profile management - login/register handled by Firebase SDK directly)
  registerProfile: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Transactions
  getTransactions: (params = '') => request(`/transactions?${params}`),
  getStats: () => request('/transactions/stats'),
  createTransaction: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransactionStatus: (id, status) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Webhooks
  getWebhooks: () => request('/webhooks'),
  createWebhook: (data) => request('/webhooks', { method: 'POST', body: JSON.stringify(data) }),
  updateWebhook: (id, data) => request(`/webhooks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWebhook: (id) => request(`/webhooks/${id}`, { method: 'DELETE' }),
  simulateWebhook: (id, event) => request('/webhooks/simulate', { method: 'POST', body: JSON.stringify({ webhookId: id, event }) }),
  getWebhookLogs: () => request('/webhooks/logs'),

  // API Keys
  getApiKeys: () => request('/keys'),
  regenerateKey: (keyType) => request('/keys', { method: 'POST', body: JSON.stringify({ keyType }) }),
};
