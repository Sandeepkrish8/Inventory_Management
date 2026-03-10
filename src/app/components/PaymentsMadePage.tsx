import React, { useState } from 'react';
import { Search, Plus, ArrowUpCircle, CreditCard } from 'lucide-react';
import { mockPaymentsMade } from '@/app/data/mockData';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function PaymentsMadePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const payments = mockPaymentsMade;

  const filtered = payments.filter(p =>
    p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments Made</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track payments made to suppliers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-1"><ArrowUpCircle className="w-4 h-4 text-red-500" /><p className="text-xs text-slate-500 font-semibold">Total Paid</p></div>
          <p className="text-2xl font-bold text-red-600">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-semibold">Completed</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{payments.filter(p => p.status === 'Completed').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-amber-600 font-semibold">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{payments.filter(p => p.status === 'Pending').length}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search payments..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Payment #</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Supplier</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bill</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Method</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-blue-600 dark:text-blue-400">{p.paymentNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{p.supplierName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{p.billId}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{p.date}</td>
                  <td className="py-3 px-4 text-sm"><span className="flex items-center gap-1 text-slate-600 dark:text-slate-300"><CreditCard className="w-3 h-3" />{p.method}</span></td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-red-600">${p.amount.toFixed(2)}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-slate-400">No payments found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
