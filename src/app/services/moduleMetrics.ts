import { Product } from '@/app/types';
import { mockOrders } from '@/app/data/mockData';

export interface ModuleMetrics {
  totalProducts: number;
  lowStockAlerts: number;
  recentOrders: number;
  totalRevenue: number;
  revenueChange: number;
  ordersChange: number;
}

export function getModuleMetrics(module: 'general' | 'pharmacy' | 'manufacturing', products: Product[]): ModuleMetrics {
  const filtered = products.filter(p => {
    if (module === 'general') return true;
    if (module === 'pharmacy') return p.category === 'Pharmacy' || !!p.medicineName;
    if (module === 'manufacturing') return p.category === 'Manufacturing' || !!p.productType;
    return true;
  });

  const totalProducts = filtered.length;
  const lowStockAlerts = filtered.filter(p => p.quantity <= (p.minStockLevel ?? 0)).length;

  // Simple recent orders: count orders referencing filtered products
  const productIds = new Set(filtered.map(p => p.id));
  const recentOrders = mockOrders.filter(o => o.items.some(i => productIds.has(i.productId))).length;

  // Revenue (approx): sum of completed order items for these products
  const totalRevenue = mockOrders
    .filter(o => o.status === 'Completed')
    .flatMap(o => o.items)
    .filter(i => productIds.has(i.productId))
    .reduce((s, it) => s + (it.total || (it.quantity * (it.unitPrice || 0))), 0);

  // Mock changes (placeholders)
  const revenueChange = Math.round((Math.random() * 10 - 5) * 10) / 10; // -5 to +5
  const ordersChange = Math.round((Math.random() * 10 - 5) * 10) / 10;

  return { totalProducts, lowStockAlerts, recentOrders, totalRevenue, revenueChange, ordersChange };
}

export default {};
