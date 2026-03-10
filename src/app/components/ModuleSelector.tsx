import React from 'react';
import { useModule } from '@/app/contexts/ModuleContext';
import { Select } from '@/app/components/ui/select';

export const ModuleSelector: React.FC<{ className?: string }> = ({ className }) => {
  const { module, setModule } = useModule();

  return (
    <div className={className}>
      <label className="sr-only">Select Module</label>
      <div className="flex items-center gap-2">
        <select
          value={module}
          onChange={(e) => setModule(e.target.value as any)}
          className="px-3 py-2 border rounded-md bg-white text-sm shadow-sm focus:outline-none"
          aria-label="Module selector"
        >
          <option value="general">General Inventory</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="manufacturing">Manufacturing</option>
        </select>
      </div>
    </div>
  );
};

export default ModuleSelector;
