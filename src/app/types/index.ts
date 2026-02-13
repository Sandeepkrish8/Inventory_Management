// Type definitions for Inventory Management System

export type UserRole = 'Admin' | 'Staff' | 'Viewer';

export type EnvironmentType = 'development' | 'staging' | 'production';
export type TenantSubscription = 'free' | 'pro' | 'enterprise';
export type BiometricType = 'fingerprint' | 'face' | 'nfc';
export type AuthMethod = 'password' | 'biometric' | 'otp';

export interface BiometricAuth {
  id: string;
  userId: string;
  type: BiometricType;
  publicKey: string;
  deviceId: string;
  deviceName: string;
  enrolledAt: string;
  lastUsedAt?: string;
}

export interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  url: string;
  status: 'active' | 'inactive' | 'maintenance';
  dbSyncStatus: 'synced' | 'syncing' | 'error' | 'offline';
  lastSyncAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  subscription: TenantSubscription;
  environments: Environment[];
  createdAt: string;
}

export interface UserTenantRole {
  tenantId: string;
  role: UserRole;
  permissions?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  biometricEnabled?: boolean;
  biometricDevices?: BiometricAuth[];
  tenants?: UserTenantRole[];
  currentTenant?: string;
  currentEnvironment?: string;
  lastLoginAt?: string;
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

// Purchase Orders
export type PurchaseOrderStatus = 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  total: number;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  notes?: string;
  createdBy: string;
}

// Customers
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderDate?: string;
  status: 'Active' | 'Inactive';
}

// Stock Adjustments
export type AdjustmentReason = 'Damage' | 'Loss' | 'Found' | 'Recount' | 'Return' | 'Other';

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: AdjustmentReason;
  notes?: string;
  performedBy: string;
  date: string;
  reference?: string;
}

// Invoices
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Bank Transfer' | 'Cheque' | 'Other';

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

// Low Stock Alerts
export type AlertPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export interface LowStockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStockLevel: number;
  reorderQuantity: number;
  priority: AlertPriority;
  status: AlertStatus;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

// Returns & Refunds
export type ReturnType = 'Customer Return' | 'Supplier Return';
export type ReturnStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';
export type ReturnReason = 'Defective' | 'Wrong Item' | 'Not Needed' | 'Damaged' | 'Other';
export type RefundStatus = 'Pending' | 'Approved' | 'Processed' | 'Rejected';

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Return {
  id: string;
  returnNumber: string;
  type: ReturnType;
  orderId?: string;
  customerId?: string;
  customerName?: string;
  supplierId?: string;
  supplierName?: string;
  items: ReturnItem[];
  reason: ReturnReason;
  total: number;
  status: ReturnStatus;
  refundStatus?: RefundStatus;
  requestDate: string;
  approvedDate?: string;
  completedDate?: string;
  notes?: string;
  createdBy: string;
}

// Warehouses & Locations
export type LocationType = 'Warehouse' | 'Zone' | 'Aisle' | 'Bin';

export interface Location {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  parentId?: string;
  address?: string;
  city?: string;
  country?: string;
  capacity?: number;
  currentUtilization?: number;
  isActive: boolean;
  createdAt: string;
}

export interface StockByLocation {
  locationId: string;
  locationName: string;
  productId: string;
  productName: string;
  quantity: number;
  reservedQuantity?: number;
  availableQuantity: number;
}

// Stock Transfers
export type TransferStatus = 'Draft' | 'Pending' | 'In Transit' | 'Received' | 'Cancelled';

export interface TransferItem {
  productId: string;
  productName: string;
  quantity: number;
  receivedQuantity?: number;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  items: TransferItem[];
  status: TransferStatus;
  requestDate: string;
  approvedDate?: string;
  shippedDate?: string;
  receivedDate?: string;
  notes?: string;
  requestedBy: string;
  approvedBy?: string;
}

// User Management (Extended)
export interface UserManagement extends User {
  status: 'Active' | 'Inactive' | 'Suspended';
  department?: string;
  position?: string;
  phone?: string;
  createdAt: string;
  createdBy?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
}
