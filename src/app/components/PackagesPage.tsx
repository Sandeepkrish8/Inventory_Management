import React, { useState } from 'react';
import { Search, Package, Eye, Plus } from 'lucide-react';
import { mockPackages } from '@/app/data/mockData';

const statusColors: Record<string, string> = {
  'Not Packed': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  'Packed': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Shipped': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Delivered': 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const packages = mockPackages;

  const filtered = packages.filter(p => {
    const match = p.packageNumber.toLowerCase().includes(searchTerm.toLowerCase()) || p.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || p.status === statusFilter;
    return match && statusMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Packages</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create and manage packages for sales orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Package
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Not Packed', 'Packed', 'Shipped', 'Delivered'].map(s => (
          <div key={s} className={`rounded-xl p-3 text-center ${statusColors[s]}`}>
            <p className="text-xs font-semibold">{s}</p>
            <p className="text-xl font-bold">{packages.filter(p => p.status === s).length}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search packages..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
          <option value="All">All Status</option>
          <option>Not Packed</option>
          <option>Packed</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Package #</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Sales Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Items</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(pkg => (
                <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-teal-600 dark:text-teal-400">{pkg.packageNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{pkg.salesOrderNumber}</td>
                  <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{pkg.customerName}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{pkg.date}</td>
                  <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[pkg.status] || ''}`}>{pkg.status}</span></td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">{pkg.items.length} item(s)</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => setSelectedPkg(pkg)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-slate-500" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-slate-400">No packages found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPkg && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPkg(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedPkg.packageNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedPkg.status]}`}>{selectedPkg.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-500">Customer</p><p className="font-medium dark:text-white">{selectedPkg.customerName}</p></div>
              <div><p className="text-slate-500">Sales Order</p><p className="font-medium dark:text-white">{selectedPkg.salesOrderNumber}</p></div>
              <div><p className="text-slate-500">Weight</p><p className="font-medium dark:text-white">{selectedPkg.weight || '—'}</p></div>
              <div><p className="text-slate-500">Dimensions</p><p className="font-medium dark:text-white">{selectedPkg.dimensions || '—'}</p></div>
            </div>
            <div>
              <h3 className="font-semibold dark:text-white mb-2">Packed Items</h3>
              {selectedPkg.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-1.5 border-b dark:border-slate-700/50 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{item.productName} ({item.sku})</span>
                  <span className="font-medium dark:text-white">{item.packedQty}/{item.orderedQty}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedPkg(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
