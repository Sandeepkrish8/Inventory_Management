import React, { useState } from 'react';
import { Search, Plus, Eye, FileText } from 'lucide-react';
import { mockCreditNotes } from '@/app/data/mockData';

const statusColors: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Open: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Applied: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function CreditNotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockCreditNotes.filter(cn =>
    cn.creditNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cn.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOpen = mockCreditNotes.filter(c => c.status === 'Open').reduce((s, c) => s + c.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Credit Notes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Issue and manage credit notes for customers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Credit Note
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-slate-500 font-semibold">Total Notes</p><p className="text-2xl font-bold dark:text-white">{mockCreditNotes.length}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-teal-600 font-semibold">Open Balance</p><p className="text-2xl font-bold text-teal-600">${totalOpen.toFixed(2)}</p></div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs text-green-600 font-semibold">Applied</p><p className="text-2xl font-bold text-green-600">{mockCreditNotes.filter(c => c.status === 'Applied').length}</p></div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search credit notes..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Credit Note #</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Invoice</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Reason</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Balance</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(cn => (
                <tr key={cn.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-teal-600 dark:text-teal-400">{cn.creditNoteNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{cn.customerName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{cn.invoiceId}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{cn.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{cn.reason}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[cn.status]}`}>{cn.status}</span></td>
                  <td className="py-3 px-4 text-right text-sm font-medium dark:text-white">${cn.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-teal-600">{cn.balance > 0 ? `$${cn.balance.toFixed(2)}` : '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-slate-400">No credit notes found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
