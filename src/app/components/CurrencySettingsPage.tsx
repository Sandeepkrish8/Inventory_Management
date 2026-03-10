import React, { useState } from 'react';
import { Globe, Plus, CheckCircle2, Star, ArrowRightLeft, Pencil } from 'lucide-react';
import { mockCurrencies } from '@/app/data/mockData';

export function CurrencySettingsPage() {
  const [currencies, setCurrencies] = useState(mockCurrencies);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Currency Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage currencies and exchange rates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Currency
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Currency</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Code</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Symbol</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Exchange Rate</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Format</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {currencies.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{c.name}</span>
                      {c.isBase && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-500">{c.code}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300 font-medium">{c.symbol}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                      <span className="text-sm font-semibold dark:text-white">{c.exchangeRate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-slate-500 font-mono">{c.format}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                      <CheckCircle2 className="w-3 h-3" />{c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><Pencil className="w-4 h-4 text-slate-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
