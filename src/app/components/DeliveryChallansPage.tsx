import React, { useState } from 'react';
import { Search, Plus, Eye, FileText } from 'lucide-react';
import { mockDeliveryChallans } from '@/app/data/mockData';

const statusColors: Record<string, string> = {
  Open: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Invoiced: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function DeliveryChallansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockDeliveryChallans.filter(dc =>
    dc.challanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dc.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Delivery Challans</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage delivery notes for goods sent on approval or job work</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Challan
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search challans..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Challan #</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Items</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(dc => (
                <tr key={dc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-teal-600 dark:text-teal-400">{dc.challanNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{dc.customerName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{dc.type}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{dc.date}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[dc.status] || ''}`}>{dc.status}</span></td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{dc.items.length} item(s)</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold dark:text-white">${dc.total.toFixed(2)}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-slate-400">No delivery challans found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
