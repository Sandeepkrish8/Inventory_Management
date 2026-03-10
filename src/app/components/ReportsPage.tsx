import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Download, Calendar, Filter } from 'lucide-react';
import { mockReports } from '@/app/data/mockData';

const categoryIcons: Record<string, React.ReactNode> = {
  Sales: <TrendingUp className="w-5 h-5 text-green-600" />,
  Inventory: <Package className="w-5 h-5 text-teal-600" />,
  Purchases: <DollarSign className="w-5 h-5 text-orange-600" />,
  Customers: <Users className="w-5 h-5 text-teal-600" />,
  Tax: <BarChart3 className="w-5 h-5 text-red-600" />,
};

export function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(mockReports.map(r => r.category)))];
  const filtered = selectedCategory === 'All' ? mockReports : mockReports.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate and view business reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm hover:shadow-md transition-all">
            <Calendar className="w-4 h-4" /> Schedule
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(report => (
          <div key={report.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                {categoryIcons[report.category] || <BarChart3 className="w-5 h-5 text-slate-500" />}
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-medium hover:bg-teal-100">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{report.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{report.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 font-medium">{report.category}</span>
              <span className="text-xs text-slate-400">Last: {report.lastGenerated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
