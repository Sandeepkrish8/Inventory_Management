import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { TenantProvider, useTenant } from '@/app/contexts/TenantContext';
import { AIProvider } from '@/app/contexts/AIContext';
import { BiometricGateway } from '@/app/components/BiometricGateway';
import { TenantSelector } from '@/app/components/TenantSelector';
import { LoginPage } from '@/app/components/LoginPage';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { Dashboard } from '@/app/components/Dashboard';
import { ProductsPage } from '@/app/components/ProductsPage';
import { CategoriesPage } from '@/app/components/CategoriesPage';
import { SuppliersPage } from '@/app/components/SuppliersPage';
import { TransactionsPage } from '@/app/components/TransactionsPage';
import { OrdersPage } from '@/app/components/OrdersPage';
import { AnalyticsPage } from '@/app/components/AnalyticsPage';
import { ProfileSettings } from '@/app/components/ProfileSettings';
import { PurchaseOrdersPage } from '@/app/components/PurchaseOrdersPage';
import { CustomersPage } from '@/app/components/CustomersPage';
import { StockAdjustmentsPage } from '@/app/components/StockAdjustmentsPage';
import { InvoicingPage } from '@/app/components/InvoicingPage';
import { LowStockAlertsPage } from '@/app/components/LowStockAlertsPage';
import { ReturnsRefundsPage } from '@/app/components/ReturnsRefundsPage';
import { UsersManagementPage } from '@/app/components/UsersManagementPage';
import { WarehousesPage } from '@/app/components/WarehousesPage';
import { StockTransfersPage } from '@/app/components/StockTransfersPage';
import { AIDashboard } from '@/app/components/AIDashboard';
import { AIChatAssistant } from '@/app/components/AIChatAssistant';
import { Toaster } from '@/app/components/ui/sonner';
import { mockTenants, mockUserTenantRoles } from '@/app/data/mockData';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { currentTenant, currentEnvironment, setAvailableTenants } = useTenant();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authFlowStep, setAuthFlowStep] = useState('biometric');

  // Initialize tenants when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Set available tenants based on user's tenant roles
      const userTenants = mockTenants.filter(tenant =>
        mockUserTenantRoles.some(role => role.tenantId === tenant.id)
      );

      setAvailableTenants(userTenants);

      // Update user with tenant roles
      const updatedUser = {
        ...user,
        tenants: mockUserTenantRoles,
      };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  }, [isAuthenticated, user, setAvailableTenants]);

  // Manage authentication flow
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthFlowStep('biometric');
    } else if (!currentTenant || !currentEnvironment) {
      setAuthFlowStep('tenant-selector');
    } else {
      setAuthFlowStep('authenticated');
    }
  }, [isAuthenticated, currentTenant, currentEnvironment]);

  // Render based on auth flow step
  if (authFlowStep === 'biometric') {
    return <BiometricGateway onSuccess={() => setAuthFlowStep('tenant-selector')} />;
  }

  if (authFlowStep === 'tenant-selector') {
    return <TenantSelector onComplete={() => setAuthFlowStep('authenticated')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={(page) => setCurrentPage(page)} />;
      case 'ai-dashboard':
        return <AIDashboard onNavigate={(page) => setCurrentPage(page)} />;
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
      case 'purchase-orders':
        return <PurchaseOrdersPage />;
      case 'customers':
        return <CustomersPage />;
      case 'stock-adjustments':
        return <StockAdjustmentsPage />;
      case 'invoices':
        return <InvoicingPage />;
      case 'low-stock-alerts':
        return <LowStockAlertsPage />;
      case 'returns':
        return <ReturnsRefundsPage />;
      case 'users':
        return <UsersManagementPage />;
      case 'warehouses':
        return <WarehousesPage />;
      case 'stock-transfers':
        return <StockTransfersPage />;
      case 'settings':
        return <ProfileSettings />;
      default:
        return <Dashboard onNavigate={(page) => setCurrentPage(page)} />;
    }
  };

  return (
    <>
      <DashboardLayout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page)}>
        {renderPage()}
      </DashboardLayout>
      <AIChatAssistant onNavigate={(page) => setCurrentPage(page)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AIProvider>
          <AppContent />
          <Toaster />
        </AIProvider>
      </TenantProvider>
    </AuthProvider>
  );
}
