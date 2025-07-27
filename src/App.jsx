import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import LoginPage from './pages/LoginPage.tsx';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ConversationsPage from './pages/ConversationsPage';
import CallsPage from './pages/CallsPage';
import LeadsPage from './pages/LeadsPage';
import SettingsPage from './pages/SettingsPage';
import ProposalsPage from './pages/ProposalsPage';
import InvoicesPage from './pages/InvoicesPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/users/UsersPage';
import OffersPage from './pages/admin/offers/OffersPage';
import AdminInvoicesPage from './pages/admin/invoices/InvoicesPage';

import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Customer Dashboard Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="calls" element={<CallsPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route path="/admin" element={isAdminAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="invoices" element={<AdminInvoicesPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
