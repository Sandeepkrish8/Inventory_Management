import React, { useState } from 'react';
import { Search, Plus, Filter, FileText, ChevronRight, Eye, Truck, Package, CheckCircle2, Clock, Edit, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { mockSalesOrders } from '@/app/data/mockData';

const statusConfig: Record<string, { color: string; bg: string }> = {
  Draft: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  Confirmed: { color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30' },
  Packed: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  Shipped: { color: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30' },
  Delivered: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' },
};

export function SalesOrdersPage() {
  const [orders, setOrders] = useState(mockSalesOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const statuses = ['All', 'Draft', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const advanceStatus = (id: string) => {
    const flow = ['Draft', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const idx = flow.indexOf(o.status);
      if (idx < flow.length - 1) return { ...o, status: flow[idx + 1] };
      return o;
    }));
  };

  const nextStatus = (current: string) => {
    const flow = ['Draft', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Orders</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage sales order lifecycle from draft to delivery</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Sales Order
        </button>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-5 gap-2">
        {['Draft', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map(s => {
          const count = orders.filter(o => o.status === s).length;
          const cfg = statusConfig[s];
          return (
            <div key={s} className={`${cfg.bg} rounded-xl p-3 text-center`}>
              <p className={`text-xs font-semibold ${cfg.color}`}>{s}</p>
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === s ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Order #</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(order => {
                const cfg = statusConfig[order.status] || statusConfig.Draft;
                const next = nextStatus(order.status);
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <button onClick={() => setSelectedOrder(order)} className="text-teal-600 dark:text-teal-400 font-medium hover:underline text-sm">{order.orderNumber}</button>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{order.customerName}</td>
                    <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-slate-900 dark:text-white">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" title="View"><Eye className="w-4 h-4 text-slate-500" /></button>
                        {next && (
                          <button onClick={() => advanceStatus(order.id)} className="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-100 font-medium" title={`Advance to ${next}`}>
                            → {next}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">No sales orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedOrder.orderNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(statusConfig[selectedOrder.status] || statusConfig.Draft).color} ${(statusConfig[selectedOrder.status] || statusConfig.Draft).bg}`}>{selectedOrder.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500">Customer</p><p className="font-medium text-slate-900 dark:text-white">{selectedOrder.customerName}</p></div>
              <div><p className="text-slate-500">Date</p><p className="font-medium text-slate-900 dark:text-white">{selectedOrder.date}</p></div>
              <div><p className="text-slate-500">Ship By</p><p className="font-medium text-slate-900 dark:text-white">{selectedOrder.expectedShipDate}</p></div>
              <div><p className="text-slate-500">Created By</p><p className="font-medium text-slate-900 dark:text-white">{selectedOrder.createdBy}</p></div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Items</h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b dark:border-slate-700"><th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr></thead>
                <tbody>
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <tr key={i} className="border-b dark:border-slate-700/50"><td className="py-2 text-slate-700 dark:text-slate-300">{item.productName}</td><td className="text-right py-2">{item.quantity}</td><td className="text-right py-2">${item.unitPrice}</td><td className="text-right py-2 font-medium">${item.total.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-4 text-sm pt-2 border-t dark:border-slate-700">
              <div>Subtotal: <span className="font-semibold">${selectedOrder.subtotal?.toFixed(2)}</span></div>
              <div>Tax: <span className="font-semibold">${selectedOrder.tax?.toFixed(2)}</span></div>
              <div>Total: <span className="font-bold text-lg">${selectedOrder.total?.toFixed(2)}</span></div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
