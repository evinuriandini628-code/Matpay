import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { auth, onAuthStateChanged } from './utils/firebase';
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
  const authLoading = useStore((s) => s.authLoading);

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f8ff]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const setAuth = useStore((s) => s.setAuth);
  const fetchUser = useStore((s) => s.fetchUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setAuth(firebaseUser);
        await fetchUser();
      } else {
        setAuth(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
