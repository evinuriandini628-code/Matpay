const API_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('matpay_token');
}

function setToken(token) {
  localStorage.setItem('matpay_token', token);
}

function removeToken() {
  localStorage.removeItem('matpay_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
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

export { getToken, setToken, removeToken };
