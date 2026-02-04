// Type definitions for Inventory Management System

export type UserRole = 'Admin' | 'Staff' | 'Viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  supplier: string;
  quantity: number;
  minStockLevel: number;
  unitPrice: number;
  sellingPrice: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out';
  quantity: number;
  date: string;
  performedBy: string;
  notes?: string;
  reference?: string;
}

export type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  completedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardMetrics {
  totalProducts: number;
  lowStockAlerts: number;
  recentOrders: number;
  totalRevenue: number;
  revenueChange: number;
  ordersChange: number;
}
