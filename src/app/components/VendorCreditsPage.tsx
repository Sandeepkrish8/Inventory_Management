import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { mockVendorCredits } from '@/app/data/mockData';

const statusColors: Record<string, string> = {
  Open: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Applied: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export function VendorCreditsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockVendorCredits.filter(vc =>
    vc.creditNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vc.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendor Credits</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Credits received from suppliers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Vendor Credit
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search vendor credits..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Credit #</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Supplier</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bill</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Reason</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Balance</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(vc => (
                <tr key={vc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-teal-600 dark:text-teal-400">{vc.creditNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{vc.supplierName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{vc.billId}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{vc.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{vc.reason}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[vc.status] || ''}`}>{vc.status}</span></td>
                  <td className="py-3 px-4 text-right text-sm font-medium dark:text-white">${vc.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-teal-600">{vc.balance > 0 ? `$${vc.balance.toFixed(2)}` : '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-slate-400">No vendor credits found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
