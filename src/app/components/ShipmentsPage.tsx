import React, { useState } from 'react';
import { Search, Truck, Eye, Plus, MapPin } from 'lucide-react';
import { mockShipments } from '@/app/data/mockData';

const statusColors: Record<string, string> = {
  'In Transit': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Delivered': 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Pending': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const shipments = mockShipments;

  const filtered = shipments.filter(s =>
    s.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shipments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track shipments and delivery status</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Shipment
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(statusColors).map(([status, cls]) => (
          <div key={status} className={`rounded-xl p-4 text-center ${cls}`}>
            <p className="text-xs font-semibold">{status}</p>
            <p className="text-2xl font-bold">{shipments.filter(s => s.status === status).length}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by shipment #, customer, or tracking #..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
      </div>

      <div className="grid gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{s.shipmentNumber}</p>
                  <p className="text-xs text-slate-500">{s.customerName} · {s.salesOrderNumber}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${statusColors[s.status] || ''}`}>{s.status}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div><p className="text-slate-500 text-xs">Carrier</p><p className="font-medium text-slate-900 dark:text-white">{s.carrier}</p></div>
              <div><p className="text-slate-500 text-xs">Tracking</p><p className="font-mono text-xs text-teal-600 dark:text-teal-400">{s.trackingNumber}</p></div>
              <div><p className="text-slate-500 text-xs">Ship Date</p><p className="font-medium text-slate-900 dark:text-white">{s.shipDate}</p></div>
              <div><p className="text-slate-500 text-xs">{s.deliveredDate ? 'Delivered' : 'Expected'}</p><p className="font-medium text-slate-900 dark:text-white">{s.deliveredDate || s.expectedDelivery}</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />{s.shippingAddress}
            </div>

            {/* Timeline */}
            <div className="mt-3 flex items-center gap-1">
              {['Packed', 'Shipped', 'In Transit', 'Delivered'].map((step, i) => {
                const isReached = s.status === 'Delivered' || (s.status === 'In Transit' && i <= 2) || (i === 0);
                return (
                  <React.Fragment key={step}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isReached ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>{i + 1}</div>
                    {i < 3 && <div className={`flex-1 h-0.5 ${isReached ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400">No shipments found</div>}
      </div>
    </div>
  );
}
