import React, { useState } from 'react';
import { Activity, User, Package, FileText, Settings, Filter, Search } from 'lucide-react';
import { mockActivityLog } from '@/app/data/mockData';

const typeIcons: Record<string, React.ReactNode> = {
  'item-update': <Package className="w-4 h-4 text-teal-500" />,
  'order-create': <FileText className="w-4 h-4 text-green-500" />,
  'invoice-create': <FileText className="w-4 h-4 text-teal-500" />,
  'payment-received': <FileText className="w-4 h-4 text-emerald-500" />,
  'settings-change': <Settings className="w-4 h-4 text-orange-500" />,
  'user-login': <User className="w-4 h-4 text-slate-500" />,
};

const typeColors: Record<string, string> = {
  'item-update': 'bg-teal-100 dark:bg-teal-900/30',
  'order-create': 'bg-green-100 dark:bg-green-900/30',
  'invoice-create': 'bg-teal-100 dark:bg-teal-900/30',
  'payment-received': 'bg-emerald-100 dark:bg-emerald-900/30',
  'settings-change': 'bg-orange-100 dark:bg-orange-900/30',
  'user-login': 'bg-slate-100 dark:bg-slate-700',
};

export function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const types = ['All', ...Array.from(new Set(mockActivityLog.map(a => a.type)))];

  const filtered = mockActivityLog.filter(a => {
    const matchesSearch = a.description.toLowerCase().includes(searchTerm.toLowerCase()) || a.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Activity Log</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track all changes and actions in your organization</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search activity..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
          {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filtered.map(activity => (
            <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[activity.type] || 'bg-slate-100'}`}>
                {typeIcons[activity.type] || <Activity className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">{activity.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><User className="w-3 h-3" />{activity.user}</span>
                  <span className="text-xs text-slate-400">{activity.timestamp}</span>
                  {activity.module && <span className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">{activity.module}</span>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-12 text-center text-slate-400">No activity found</div>}
        </div>
      </div>
    </div>
  );
}
