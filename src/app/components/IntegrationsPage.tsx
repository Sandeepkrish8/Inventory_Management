import React, { useState } from 'react';
import { Search, Plug, CheckCircle2, XCircle, ExternalLink, Settings, Zap, ToggleRight, ToggleLeft } from 'lucide-react';
import { mockIntegrations } from '@/app/data/mockData';

const categoryColors: Record<string, string> = {
  Accounting: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Payments: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  Shipping: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  CRM: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  'E-Commerce': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  Communication: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
};

export function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(mockIntegrations.map(i => i.category)))];
  const filtered = mockIntegrations.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || i.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Integrations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Connect with third-party applications</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search integrations..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${categoryFilter === cat ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(integration => (
          <div key={integration.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{integration.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[integration.category] || 'bg-slate-100 text-slate-500'}`}>{integration.category}</span>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${integration.isConnected ? 'text-green-600' : 'text-slate-400'}`}>
                {integration.isConnected ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {integration.isConnected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{integration.description}</p>
            <div className="flex items-center justify-between">
              <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${integration.isConnected ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                {integration.isConnected ? <><Settings className="w-3 h-3" /> Configure</> : <><Zap className="w-3 h-3" /> Connect</>}
              </button>
              {integration.lastSync && <span className="text-xs text-slate-400">Last sync: {integration.lastSync}</span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center py-12 text-slate-400">No integrations found</div>}
      </div>
    </div>
  );
}
