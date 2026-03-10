import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { mockProducts } from '@/app/data/mockData';
import { getRawMaterialStock, getProductionStatus, getReorderAlerts } from '@/app/services/moduleHelpers';
import { Warehouse, RefreshCw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

export const ManufacturingDashboardCards: React.FC = () => {
  const manufacturingProducts = mockProducts.filter(p => p.category === 'Manufacturing' || p.productType);
  const rawMaterials = getRawMaterialStock(manufacturingProducts);
  const production = getProductionStatus(manufacturingProducts.filter(p => p.productType === 'finished' || p.productionDate));
  const reorder = getReorderAlerts(manufacturingProducts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Warehouse className="w-4 h-4 text-green-600" />Raw Material Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-2">Total raw materials: {rawMaterials.length}</p>
          <div className="space-y-2 text-sm">
            {rawMaterials.slice(0,5).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-xs text-slate-500">Loc: {p.warehouseLocation || '—'}</p>
                </div>
                <Badge>{p.quantity} units</Badge>
              </div>
            ))}
            {rawMaterials.length === 0 && <p className="text-sm text-slate-500">No raw materials found</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-blue-600" />Production Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {production.slice(0,5).map(p => (
              <div key={p.product.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.product.name}</p>
                  <p className="text-xs text-slate-500">{p.product.productType || '—'}</p>
                </div>
                <Badge>{p.status}</Badge>
              </div>
            ))}
            {production.length === 0 && <p className="text-sm text-slate-500">No production records</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-600" />Reorder Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {reorder.slice(0,5).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-xs text-slate-500">Qty: {p.quantity} • Reorder: {p.reorderLevel}</p>
                </div>
                <Badge variant="destructive">Reorder</Badge>
              </div>
            ))}
            {reorder.length === 0 && <p className="text-sm text-slate-500">No reorder alerts</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturingDashboardCards;
