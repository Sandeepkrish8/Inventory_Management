import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { mockProducts } from '@/app/data/mockData';
import { getExpiringMedicines, getExpiredMedicines, groupBatches } from '@/app/services/moduleHelpers';
import { Badge } from '@/app/components/ui/badge';
import { AlertTriangle, Clock, Layers } from 'lucide-react';

export const PharmacyDashboardCards: React.FC = () => {
  const pharmacyProducts = mockProducts.filter(p => p.category === 'Pharmacy' || p.medicineName);
  const expiring = getExpiringMedicines(pharmacyProducts, 30);
  const expired = getExpiredMedicines(pharmacyProducts);
  const batches = groupBatches(pharmacyProducts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" />Expiring Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-2">Within next 30 days</p>
          <div className="space-y-2">
            {expiring.slice(0,5).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.medicineName || p.name}</p>
                  <p className="text-xs text-slate-500">Batch: {p.batchNumber || '—'}</p>
                </div>
                <Badge>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : '—'}</Badge>
              </div>
            ))}
            {expiring.length === 0 && <p className="text-sm text-slate-500">No expiring medicines</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" />Expired Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {expired.slice(0,5).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.medicineName || p.name}</p>
                  <p className="text-xs text-slate-500">Batch: {p.batchNumber || '—'}</p>
                </div>
                <Badge variant="destructive">Expired</Badge>
              </div>
            ))}
            {expired.length === 0 && <p className="text-sm text-slate-500">No expired medicines</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600" />Batch Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-2">Unique batches: {batches.size}</p>
          <div className="space-y-1 text-sm">
            {Array.from(batches.entries()).slice(0,5).map(([batch, items]) => (
              <div key={batch} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate">{batch}</p>
                  <p className="text-xs text-slate-500">{items.length} item(s)</p>
                </div>
                <Badge>{items.reduce((s, i) => s + (i.quantity || 0), 0)} units</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyDashboardCards;
