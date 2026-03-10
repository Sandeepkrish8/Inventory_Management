import React, { useState } from 'react';
import { Search, Plus, Tag, CheckCircle2, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { mockPriceLists } from '@/app/data/mockData';

export function PriceListsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedList, setSelectedList] = useState<any>(null);

  const filtered = mockPriceLists.filter(pl =>
    pl.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Price Lists</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage multiple pricing tiers for different customers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Price List
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search price lists..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(pl => (
          <div key={pl.id} onClick={() => setSelectedList(pl)} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pl.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Tag className={`w-5 h-5 ${pl.isActive ? 'text-green-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{pl.name}</h3>
                  <p className="text-xs text-slate-500">{pl.description}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${pl.isActive ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                {pl.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {pl.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">Type</p>
                <p className="font-semibold text-sm dark:text-white">{pl.type}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">{pl.percentage ? 'Discount' : 'Items'}</p>
                <p className="font-semibold text-sm dark:text-white">{pl.percentage ? `${pl.percentage}%` : pl.itemCount}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">Currency</p>
                <p className="font-semibold text-sm dark:text-white">{pl.currency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedList && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedList(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold dark:text-white">{selectedList.name}</h2>
            <p className="text-sm text-slate-500">{selectedList.description}</p>
            <table className="w-full text-sm">
              <thead><tr className="border-b dark:border-slate-700"><th className="text-left py-2 text-xs text-slate-500">Item</th><th className="text-right py-2 text-xs text-slate-500">Base Price</th><th className="text-right py-2 text-xs text-slate-500">List Price</th></tr></thead>
              <tbody>
                {selectedList.items?.map((item: any, i: number) => (
                  <tr key={i} className="border-b dark:border-slate-700/50">
                    <td className="py-2 text-slate-700 dark:text-slate-300">{item.productName}</td>
                    <td className="py-2 text-right text-slate-500">${item.basePrice.toFixed(2)}</td>
                    <td className="py-2 text-right font-semibold text-green-600">${item.listPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setSelectedList(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
