import React, { useState } from 'react';
import { Search, Plus, Eye, FileText, AlertCircle } from 'lucide-react';
import { mockBills } from '@/app/data/mockData';

const statusColors: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Open: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Overdue: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Paid: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function BillsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const filtered = mockBills.filter(b => {
    const match = b.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) || b.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || b.status === statusFilter;
    return match && statusMatch;
  });

  const totalOutstanding = mockBills.filter(b => b.status !== 'Paid').reduce((sum, b) => sum + b.balanceDue, 0);
  const totalOverdue = mockBills.filter(b => b.status === 'Overdue').reduce((sum, b) => sum + b.balanceDue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bills</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage bills received from suppliers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Bill
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-semibold">Total Bills</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{mockBills.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-slate-500 font-semibold">Outstanding</p>
          <p className="text-2xl font-bold text-amber-600">${totalOutstanding.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Overdue</p>
          <p className="text-2xl font-bold text-red-600">${totalOverdue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs text-green-600 font-semibold">Paid</p>
          <p className="text-2xl font-bold text-green-600">{mockBills.filter(b => b.status === 'Paid').length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search bills..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
          <option value="All">All Status</option>
          <option>Draft</option><option>Open</option><option>Overdue</option><option>Paid</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Bill #</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Supplier</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Balance Due</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(bill => (
                <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-teal-600 dark:text-teal-400">{bill.billNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{bill.supplierName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{bill.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{bill.dueDate}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[bill.status]}`}>{bill.status}</span></td>
                  <td className="py-3 px-4 text-right text-sm font-medium text-slate-900 dark:text-white">${bill.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-sm font-semibold text-red-600">{bill.balanceDue > 0 ? `$${bill.balanceDue.toFixed(2)}` : '—'}</td>
                  <td className="py-3 px-4 text-center"><button onClick={() => setSelectedBill(bill)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-slate-500" /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-slate-400">No bills found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBill(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold dark:text-white">{selectedBill.billNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedBill.status]}`}>{selectedBill.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-500">Supplier</p><p className="font-medium dark:text-white">{selectedBill.supplierName}</p></div>
              <div><p className="text-slate-500">Due Date</p><p className="font-medium dark:text-white">{selectedBill.dueDate}</p></div>
            </div>
            <div>
              <h3 className="font-semibold dark:text-white mb-2">Items</h3>
              {selectedBill.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-1.5 border-b dark:border-slate-700/50 text-sm">
                  <span className="dark:text-slate-300">{item.productName} × {item.quantity}</span>
                  <span className="font-medium dark:text-white">${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm pt-2 border-t dark:border-slate-700">
              <span className="text-slate-500">Total</span>
              <span className="font-bold text-lg dark:text-white">${selectedBill.total.toFixed(2)}</span>
            </div>
            <button onClick={() => setSelectedBill(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
