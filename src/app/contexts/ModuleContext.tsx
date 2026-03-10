import React, { createContext, useContext, useEffect, useState } from 'react';

export type ModuleKey = 'general' | 'pharmacy' | 'manufacturing';

interface ModuleContextValue {
  module: ModuleKey;
  setModule: (m: ModuleKey) => void;
  isModule: (m: ModuleKey) => boolean;
}

const ModuleContext = createContext<ModuleContextValue | undefined>(undefined);

const STORAGE_KEY = 'app_selected_module';

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [module, setModuleState] = useState<ModuleKey>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'pharmacy' || stored === 'manufacturing' || stored === 'general') return stored;
    } catch (e) {}
    return 'general';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, module);
    } catch (e) {}
  }, [module]);

  const setModule = (m: ModuleKey) => setModuleState(m);

  const value: ModuleContextValue = {
    module,
    setModule,
    isModule: (m: ModuleKey) => module === m,
  };

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
};

export const useModule = (): ModuleContextValue => {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error('useModule must be used within ModuleProvider');
  return ctx;
};

export default ModuleContext;
