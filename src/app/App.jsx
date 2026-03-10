import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { TenantProvider, useTenant } from '@/app/contexts/TenantContext';
import { AIProvider } from '@/app/contexts/AIContext';
import { ModuleProvider } from '@/app/contexts/ModuleContext';
import { SupportTicketProvider } from '@/app/contexts/SupportTicketContext';
import { BiometricGateway } from '@/app/components/BiometricGateway';
import { TenantSelector } from '@/app/components/TenantSelector';
import { LoginPage } from '@/app/components/LoginPage';
import { WelcomeHub } from '@/app/components/WelcomeHub';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { Dashboard } from '@/app/components/Dashboard';
import { ProductsPage } from '@/app/components/ProductsPage';
import { CategoriesPage } from '@/app/components/CategoriesPage';
import { SuppliersPage } from '@/app/components/SuppliersPage';
import { TransactionsPage } from '@/app/components/TransactionsPage';
import { OrdersPage } from '@/app/components/OrdersPage';
import { AnalyticsPage } from '@/app/components/AnalyticsPage';
import { ProfileSettings } from '@/app/components/ProfileSettings';
import { OrganizationSettings } from '@/app/components/OrganizationSettings';
import { SubscriptionPage } from '@/app/components/SubscriptionPage';
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
import { SupportTicketsPage } from '@/app/components/SupportTicketsPage';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { SalesOrdersPage } from '@/app/components/SalesOrdersPage';
import { PackagesPage } from '@/app/components/PackagesPage';
import { ShipmentsPage } from '@/app/components/ShipmentsPage';
import { BillsPage } from '@/app/components/BillsPage';
import { PaymentsReceivedPage } from '@/app/components/PaymentsReceivedPage';
import { PaymentsMadePage } from '@/app/components/PaymentsMadePage';
import { CreditNotesPage } from '@/app/components/CreditNotesPage';
import { VendorCreditsPage } from '@/app/components/VendorCreditsPage';
import { DeliveryChallansPage } from '@/app/components/DeliveryChallansPage';
import { ItemGroupsPage } from '@/app/components/ItemGroupsPage';
import { CompositeItemsPage } from '@/app/components/CompositeItemsPage';
import { PriceListsPage } from '@/app/components/PriceListsPage';
import { ReportsPage } from '@/app/components/ReportsPage';
import { ActivityLogPage } from '@/app/components/ActivityLogPage';
import { TaxRatesPage } from '@/app/components/TaxRatesPage';
import { CurrencySettingsPage } from '@/app/components/CurrencySettingsPage';
import { IntegrationsPage } from '@/app/components/IntegrationsPage';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { currentTenant, currentEnvironment, setAvailableTenants } = useTenant();
  const [currentPage, setCurrentPage] = useState('home');
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
      case 'home':
        return <WelcomeHub onNavigate={(page) => setCurrentPage(page)} />;
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
      case 'org-settings':
        return <OrganizationSettings />;
      case 'billing':
        return <SubscriptionPage />;
      case 'settings':
        return <ProfileSettings />;
      case 'support-tickets':
        return <SupportTicketsPage />;
      case 'sales-orders':
        return <SalesOrdersPage />;
      case 'packages':
        return <PackagesPage />;
      case 'shipments':
        return <ShipmentsPage />;
      case 'bills':
        return <BillsPage />;
      case 'payments-received':
        return <PaymentsReceivedPage />;
      case 'payments-made':
        return <PaymentsMadePage />;
      case 'credit-notes':
        return <CreditNotesPage />;
      case 'vendor-credits':
        return <VendorCreditsPage />;
      case 'delivery-challans':
        return <DeliveryChallansPage />;
      case 'item-groups':
        return <ItemGroupsPage />;
      case 'composite-items':
        return <CompositeItemsPage />;
      case 'price-lists':
        return <PriceListsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'activity-log':
        return <ActivityLogPage />;
      case 'tax-rates':
        return <TaxRatesPage />;
      case 'currency-settings':
        return <CurrencySettingsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      default:
        return <WelcomeHub onNavigate={(page) => setCurrentPage(page)} />;
    }
  };

  return (
    <>
      <ErrorBoundary onGoHome={() => setCurrentPage('home')}>
        <DashboardLayout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page)}>
          {renderPage()}
        </DashboardLayout>
      </ErrorBoundary>
      <AIChatAssistant onNavigate={(page) => setCurrentPage(page)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AIProvider>
          <ModuleProvider>
            <SupportTicketProvider>
              <AppContent />
              <Toaster />
            </SupportTicketProvider>
          </ModuleProvider>
        </AIProvider>
      </TenantProvider>
    </AuthProvider>
  );
}
