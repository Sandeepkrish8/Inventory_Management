import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { LoginPage } from '@/app/components/LoginPage';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { Dashboard } from '@/app/components/Dashboard';
import { ProductsPage } from '@/app/components/ProductsPage';
import { CategoriesPage } from '@/app/components/CategoriesPage';
import { SuppliersPage } from '@/app/components/SuppliersPage';
import { TransactionsPage } from '@/app/components/TransactionsPage';
import { OrdersPage } from '@/app/components/OrdersPage';
import { AnalyticsPage } from '@/app/components/AnalyticsPage';
import { Toaster } from '@/app/components/ui/sonner';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'products':
        return <ProductsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'orders':
        return <OrdersPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}