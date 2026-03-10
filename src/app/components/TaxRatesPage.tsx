import React, { useState } from 'react';
import { Plus, Receipt, Percent, ToggleLeft, ToggleRight, Pencil } from 'lucide-react';
import { mockTaxRates } from '@/app/data/mockData';

export function TaxRatesPage() {
  const [taxes, setTaxes] = useState(mockTaxRates);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tax Rates</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure tax rates for your transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Tax Rate
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {taxes.map(tax => (
          <div key={tax.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tax.isActive ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Percent className={`w-5 h-5 ${tax.isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{tax.name}</h3>
                  <p className="text-xs text-slate-500">{tax.description}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Pencil className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Rate</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{tax.rate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{tax.type}</span>
              <span className={`flex items-center gap-1 text-xs font-semibold ${tax.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                {tax.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {tax.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {tax.components && tax.components.length > 0 && (
              <div className="mt-3 pt-3 border-t dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-2">Components:</p>
                {tax.components.map((comp: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span className="text-slate-600 dark:text-slate-400">{comp.name}</span>
                    <span className="font-medium dark:text-white">{comp.rate}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
