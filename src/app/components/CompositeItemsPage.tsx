import React, { useState } from 'react';
import { Search, Plus, Package, Layers, TrendingUp } from 'lucide-react';
import { mockCompositeItems } from '@/app/data/mockData';

export function CompositeItemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockCompositeItems.filter(ci =>
    ci.name.toLowerCase().includes(searchTerm.toLowerCase()) || ci.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Composite Items</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage product bundles and bill of materials</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Composite Item
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search bundles..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="grid gap-4">
        {filtered.map(ci => (
          <div key={ci.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{ci.name}</h3>
                  <p className="text-xs text-slate-500">{ci.sku} · {ci.description}</p>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                  <p className="text-xs text-green-600 font-semibold">Selling Price</p>
                  <p className="font-bold text-green-700 dark:text-green-400">${ci.sellingPrice}</p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 px-3 py-2 rounded-lg">
                  <p className="text-xs text-teal-600 font-semibold">Margin</p>
                  <p className="font-bold text-teal-700 dark:text-teal-400">{ci.margin}%</p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 px-3 py-2 rounded-lg">
                  <p className="text-xs text-teal-600 font-semibold">Can Build</p>
                  <p className="font-bold text-teal-700 dark:text-teal-400">{ci.canBuild}</p>
                </div>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Components</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b dark:border-slate-700">
                  <th className="text-left py-2 text-xs text-slate-500">Component</th>
                  <th className="text-left py-2 text-xs text-slate-500">SKU</th>
                  <th className="text-right py-2 text-xs text-slate-500">Qty</th>
                  <th className="text-right py-2 text-xs text-slate-500">Unit Cost</th>
                  <th className="text-right py-2 text-xs text-slate-500">Total</th>
                </tr></thead>
                <tbody>
                  {ci.components.map((comp: any, i: number) => (
                    <tr key={i} className="border-b dark:border-slate-700/50">
                      <td className="py-2 text-slate-700 dark:text-slate-300">{comp.productName}</td>
                      <td className="py-2 font-mono text-xs text-slate-500">{comp.sku}</td>
                      <td className="py-2 text-right">{comp.quantity}</td>
                      <td className="py-2 text-right">${comp.unitCost.toFixed(2)}</td>
                      <td className="py-2 text-right font-medium dark:text-white">${(comp.quantity * comp.unitCost).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr><td colSpan={4} className="py-2 text-right font-semibold text-slate-700 dark:text-slate-300">Total Cost:</td><td className="py-2 text-right font-bold dark:text-white">${ci.totalCost.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400">No composite items found</div>}
      </div>
    </div>
  );
}
