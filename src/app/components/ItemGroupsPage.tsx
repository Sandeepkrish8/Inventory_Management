import React, { useState } from 'react';
import { Search, Plus, Eye, Layers, Tag } from 'lucide-react';
import { mockItemGroups } from '@/app/data/mockData';

export function ItemGroupsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const filtered = mockItemGroups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Item Groups</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage products with variants (size, color, etc.)</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Item Group
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search item groups..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="grid gap-4">
        {filtered.map(group => (
          <div key={group.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{group.name}</h3>
                  <p className="text-xs text-slate-500">{group.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{group.variants.length} variants</p>
                <p className="text-xs text-slate-500">Total stock: {group.totalStock}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              {group.attributes.map((attr: string) => (
                <span key={attr} className="flex items-center gap-1 px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-medium">
                  <Tag className="w-3 h-3" />{attr}
                </span>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b dark:border-slate-700">
                  <th className="text-left py-2 text-xs text-slate-500 font-semibold">SKU</th>
                  <th className="text-left py-2 text-xs text-slate-500 font-semibold">Variant</th>
                  <th className="text-right py-2 text-xs text-slate-500 font-semibold">Price</th>
                  <th className="text-right py-2 text-xs text-slate-500 font-semibold">Stock</th>
                </tr></thead>
                <tbody>
                  {group.variants.map((v: any) => (
                    <tr key={v.id} className="border-b dark:border-slate-700/50">
                      <td className="py-2 font-mono text-xs text-slate-500">{v.sku}</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300">{v.name}</td>
                      <td className="py-2 text-right font-medium dark:text-white">${v.price.toFixed(2)}</td>
                      <td className="py-2 text-right"><span className={`font-semibold ${v.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{v.stock}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400">No item groups found</div>}
      </div>
    </div>
  );
}
