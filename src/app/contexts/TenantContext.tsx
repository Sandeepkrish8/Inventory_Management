import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, Environment } from '@/app/types';

interface TenantContextType {
  currentTenant: Tenant | null;
  currentEnvironment: Environment | null;
  availableTenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  switchEnvironment: (environmentId: string) => void;
  setAvailableTenants: (tenants: Tenant[]) => void;
  resetTenantContext: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment | null>(null);

  // Load tenant preferences from localStorage on mount
  useEffect(() => {
    const savedTenantId = localStorage.getItem('current_tenant');
    const savedEnvironmentId = localStorage.getItem('current_environment');
    const savedTenants = localStorage.getItem('available_tenants');

    if (savedTenants) {
      try {
        const tenants: Tenant[] = JSON.parse(savedTenants);
        setAvailableTenants(tenants);

        // Restore current tenant
        if (savedTenantId) {
          const tenant = tenants.find(t => t.id === savedTenantId);
          if (tenant) {
            setCurrentTenant(tenant);

            // Restore current environment
            if (savedEnvironmentId) {
              const environment = tenant.environments.find(e => e.id === savedEnvironmentId);
              if (environment) {
                setCurrentEnvironment(environment);
              } else {
                // Default to first active environment
                const defaultEnv = tenant.environments.find(e => e.status === 'active');
                setCurrentEnvironment(defaultEnv || tenant.environments[0] || null);
              }
            } else {
              // Default to first active environment
              const defaultEnv = tenant.environments.find(e => e.status === 'active');
              setCurrentEnvironment(defaultEnv || tenant.environments[0] || null);
            }
          }
        }
      } catch (error) {
        console.error('Failed to parse saved tenants:', error);
      }
    }
  }, []);

  const switchTenant = (tenantId: string) => {
    const tenant = availableTenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      localStorage.setItem('current_tenant', tenantId);

      // Auto-select first active environment
      const defaultEnv = tenant.environments.find(e => e.status === 'active') || tenant.environments[0];
      if (defaultEnv) {
        setCurrentEnvironment(defaultEnv);
        localStorage.setItem('current_environment', defaultEnv.id);
      }

      // Save tenant preference
      const tenantPrefs = {
        lastTenantId: tenantId,
        lastEnvironmentId: defaultEnv?.id,
        switchedAt: new Date().toISOString(),
      };
      localStorage.setItem('tenant_preferences', JSON.stringify(tenantPrefs));
    }
  };

  const switchEnvironment = (environmentId: string) => {
    if (!currentTenant) return;

    const environment = currentTenant.environments.find(e => e.id === environmentId);
    if (environment) {
      setCurrentEnvironment(environment);
      localStorage.setItem('current_environment', environmentId);

      // Update tenant preference
      const tenantPrefs = JSON.parse(localStorage.getItem('tenant_preferences') || '{}');
      tenantPrefs.lastEnvironmentId = environmentId;
      tenantPrefs.switchedAt = new Date().toISOString();
      localStorage.setItem('tenant_preferences', JSON.stringify(tenantPrefs));
    }
  };

  const handleSetAvailableTenants = (tenants: Tenant[]) => {
    setAvailableTenants(tenants);
    localStorage.setItem('available_tenants', JSON.stringify(tenants));

    // Auto-select first tenant if none selected
    if (!currentTenant && tenants.length > 0) {
      switchTenant(tenants[0].id);
    }
  };

  const resetTenantContext = () => {
    setCurrentTenant(null);
    setCurrentEnvironment(null);
    setAvailableTenants([]);
    localStorage.removeItem('current_tenant');
    localStorage.removeItem('current_environment');
    localStorage.removeItem('available_tenants');
    localStorage.removeItem('tenant_preferences');
  };

  const value: TenantContextType = {
    currentTenant,
    currentEnvironment,
    availableTenants,
    switchTenant,
    switchEnvironment,
    setAvailableTenants: handleSetAvailableTenants,
    resetTenantContext,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
