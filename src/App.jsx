import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import PaymentQris from './pages/PaymentQris';
import PaymentVA from './pages/PaymentVA';
import PaymentEWallet from './pages/PaymentEWallet';
import PaymentCreditCard from './pages/PaymentCreditCard';
import Webhooks from './pages/Webhooks';
import ApiKeys from './pages/ApiKeys';
import Withdraw from './pages/Withdraw';
import Settlement from './pages/Settlement';
import Support from './pages/Support';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/payment/qris" element={<PaymentQris />} />
          <Route path="/payment/virtual-account" element={<PaymentVA />} />
          <Route path="/payment/e-wallet" element={<PaymentEWallet />} />
          <Route path="/payment/credit-card" element={<PaymentCreditCard />} />
          <Route path="/webhooks" element={<Webhooks />} />
          <Route path="/api-keys" element={<ApiKeys />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/settlement" element={<Settlement />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
