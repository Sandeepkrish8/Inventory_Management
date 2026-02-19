// Mock data for UI demonstration - Replace with API calls

export const mockProducts = [
  {
    id: '1',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    barcode: '8901234567890',
    description: 'Ergonomic wireless mouse with 2.4GHz connectivity',
    category: 'Electronics',
    supplier: 'TechSupply Co.',
    quantity: 45,
    minStockLevel: 20,
    unitPrice: 15.99,
    sellingPrice: 29.99,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
  },
  {
    id: '2',
    name: 'USB-C Cable',
    sku: 'UC-002',
    barcode: '8901234567891',
    description: '6ft USB-C to USB-C charging cable',
    category: 'Electronics',
    supplier: 'TechSupply Co.',
    quantity: 12,
    minStockLevel: 30,
    unitPrice: 5.99,
    sellingPrice: 12.99,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-02T11:20:00Z',
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    sku: 'KB-003',
    barcode: '8901234567892',
    description: 'RGB mechanical gaming keyboard with blue switches',
    category: 'Electronics',
    supplier: 'GameGear Ltd.',
    quantity: 8,
    minStockLevel: 15,
    unitPrice: 45.50,
    sellingPrice: 89.99,
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-02-03T09:45:00Z',
  },
  {
    id: '4',
    name: 'Office Chair',
    sku: 'OC-004',
    barcode: '8901234567893',
    description: 'Ergonomic office chair with lumbar support',
    category: 'Furniture',
    supplier: 'Office Essentials Inc.',
    quantity: 25,
    minStockLevel: 10,
    unitPrice: 120.00,
    sellingPrice: 249.99,
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-30T16:00:00Z',
  },
  {
    id: '5',
    name: 'Standing Desk',
    sku: 'SD-005',
    barcode: '8901234567894',
    description: 'Electric height-adjustable standing desk',
    category: 'Furniture',
    supplier: 'Office Essentials Inc.',
    quantity: 15,
    minStockLevel: 5,
    unitPrice: 280.00,
    sellingPrice: 499.99,
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-02-01T13:15:00Z',
  },
  {
    id: '6',
    name: 'Notebook Pack (10)',
    sku: 'NB-006',
    barcode: '8901234567895',
    description: 'Pack of 10 lined notebooks',
    category: 'Stationery',
    supplier: 'Paper World',
    quantity: 150,
    minStockLevel: 50,
    unitPrice: 8.50,
    sellingPrice: 19.99,
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-02-02T10:00:00Z',
  },
  {
    id: '7',
    name: 'Pen Set (12 pcs)',
    sku: 'PS-007',
    barcode: '8901234567896',
    description: 'Professional ballpoint pens, black ink',
    category: 'Stationery',
    supplier: 'Paper World',
    quantity: 5,
    minStockLevel: 25,
    unitPrice: 4.25,
    sellingPrice: 9.99,
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-02-03T08:30:00Z',
  },
  {
    id: '8',
    name: 'Monitor Stand',
    sku: 'MS-008',
    barcode: '8901234567897',
    description: 'Adjustable monitor stand with storage',
    category: 'Furniture',
    supplier: 'Office Essentials Inc.',
    quantity: 30,
    minStockLevel: 15,
    unitPrice: 22.00,
    sellingPrice: 44.99,
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-02-01T15:30:00Z',
  },
  {
    id: '9',
    name: 'Wireless Headphones',
    sku: 'WH-009',
    barcode: '8901234567898',
    description: 'Noise-cancelling Bluetooth headphones',
    category: 'Electronics',
    supplier: 'GameGear Ltd.',
    quantity: 18,
    minStockLevel: 12,
    unitPrice: 65.00,
    sellingPrice: 129.99,
    createdAt: '2024-01-25T11:20:00Z',
    updatedAt: '2024-02-02T14:00:00Z',
  },
  {
    id: '10',
    name: 'Desk Lamp',
    sku: 'DL-010',
    barcode: '8901234567899',
    description: 'LED desk lamp with adjustable brightness',
    category: 'Furniture',
    supplier: 'Office Essentials Inc.',
    quantity: 35,
    minStockLevel: 20,
    unitPrice: 18.50,
    sellingPrice: 39.99,
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-02-03T12:00:00Z',
  },
];

export const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    productCount: 4,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Furniture',
    description: 'Office and home furniture',
    productCount: 4,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '3',
    name: 'Stationery',
    description: 'Office supplies and stationery items',
    productCount: 2,
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export const mockSuppliers = [
  {
    id: '1',
    name: 'TechSupply Co.',
    contactPerson: 'John Smith',
    email: 'john@techsupply.com',
    phone: '+1-555-0101',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    productsSupplied: 2,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'GameGear Ltd.',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@gamegear.com',
    phone: '+1-555-0202',
    address: '456 Gaming Ave, Austin, TX 78701',
    productsSupplied: 2,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '3',
    name: 'Office Essentials Inc.',
    contactPerson: 'Michael Brown',
    email: 'michael@officeessentials.com',
    phone: '+1-555-0303',
    address: '789 Business Blvd, New York, NY 10001',
    productsSupplied: 4,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '4',
    name: 'Paper World',
    contactPerson: 'Emily Davis',
    email: 'emily@paperworld.com',
    phone: '+1-555-0404',
    address: '321 Paper Lane, Portland, OR 97201',
    productsSupplied: 2,
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export const mockTransactions = [
  {
    id: '1',
    productId: '1',
    productName: 'Wireless Mouse',
    type: 'stock_in',
    quantity: 50,
    date: '2024-02-01T10:00:00Z',
    performedBy: 'Admin User',
    notes: 'New shipment from supplier',
    reference: 'PO-2024-001',
  },
  {
    id: '2',
    productId: '1',
    productName: 'Wireless Mouse',
    type: 'stock_out',
    quantity: 5,
    date: '2024-02-01T14:30:00Z',
    performedBy: 'Staff User',
    notes: 'Order #ORD-1001',
    reference: 'ORD-1001',
  },
  {
    id: '3',
    productId: '2',
    productName: 'USB-C Cable',
    type: 'stock_in',
    quantity: 100,
    date: '2024-02-02T09:00:00Z',
    performedBy: 'Admin User',
    notes: 'Bulk order received',
    reference: 'PO-2024-002',
  },
  {
    id: '4',
    productId: '2',
    productName: 'USB-C Cable',
    type: 'stock_out',
    quantity: 88,
    date: '2024-02-02T11:20:00Z',
    performedBy: 'Staff User',
    notes: 'Large corporate order',
    reference: 'ORD-1002',
  },
  {
    id: '5',
    productId: '3',
    productName: 'Mechanical Keyboard',
    type: 'stock_in',
    quantity: 30,
    date: '2024-02-03T08:00:00Z',
    performedBy: 'Admin User',
    notes: 'Monthly restock',
    reference: 'PO-2024-003',
  },
  {
    id: '6',
    productId: '3',
    productName: 'Mechanical Keyboard',
    type: 'stock_out',
    quantity: 22,
    date: '2024-02-03T09:45:00Z',
    performedBy: 'Staff User',
    notes: 'Gaming store order',
    reference: 'ORD-1003',
  },
  {
    id: '7',
    productId: '7',
    productName: 'Pen Set (12 pcs)',
    type: 'stock_out',
    quantity: 20,
    date: '2024-02-03T10:30:00Z',
    performedBy: 'Staff User',
    notes: 'School supplies order',
    reference: 'ORD-1004',
  },
  {
    id: '8',
    productId: '4',
    productName: 'Office Chair',
    type: 'stock_in',
    quantity: 15,
    date: '2024-01-30T14:00:00Z',
    performedBy: 'Admin User',
    notes: 'Restocking inventory',
    reference: 'PO-2024-004',
  },
];

export const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-1001',
    customerName: 'ABC Corporation',
    items: [
      {
        productId: '1',
        productName: 'Wireless Mouse',
        quantity: 5,
        unitPrice: 29.99,
        total: 149.95,
      },
      {
        productId: '9',
        productName: 'Wireless Headphones',
        quantity: 2,
        unitPrice: 129.99,
        total: 259.98,
      },
    ],
    total: 409.93,
    status: 'Completed',
    createdAt: '2024-02-01T09:00:00Z',
    completedAt: '2024-02-01T15:00:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-1002',
    customerName: 'XYZ Technologies',
    items: [
      {
        productId: '2',
        productName: 'USB-C Cable',
        quantity: 88,
        unitPrice: 12.99,
        total: 1143.12,
      },
    ],
    total: 1143.12,
    status: 'Completed',
    createdAt: '2024-02-02T10:00:00Z',
    completedAt: '2024-02-02T12:00:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-1003',
    customerName: 'GameStop Plus',
    items: [
      {
        productId: '3',
        productName: 'Mechanical Keyboard',
        quantity: 22,
        unitPrice: 89.99,
        total: 1979.78,
      },
    ],
    total: 1979.78,
    status: 'Pending',
    createdAt: '2024-02-03T08:00:00Z',
  },
  {
    id: '4',
    orderNumber: 'ORD-1004',
    customerName: 'Springfield Elementary',
    items: [
      {
        productId: '6',
        productName: 'Notebook Pack (10)',
        quantity: 10,
        unitPrice: 19.99,
        total: 199.90,
      },
      {
        productId: '7',
        productName: 'Pen Set (12 pcs)',
        quantity: 20,
        unitPrice: 9.99,
        total: 199.80,
      },
    ],
    total: 399.70,
    status: 'Pending',
    createdAt: '2024-02-03T11:00:00Z',
  },
  {
    id: '5',
    orderNumber: 'ORD-1005',
    customerName: 'Startup Hub',
    items: [
      {
        productId: '4',
        productName: 'Office Chair',
        quantity: 8,
        unitPrice: 249.99,
        total: 1999.92,
      },
      {
        productId: '5',
        productName: 'Standing Desk',
        quantity: 5,
        unitPrice: 499.99,
        total: 2499.95,
      },
    ],
    total: 4499.87,
    status: 'Cancelled',
    createdAt: '2024-01-28T14:00:00Z',
  },
];

export const mockDashboardMetrics = {
  totalProducts: 10,
  lowStockAlerts: 3,
  recentOrders: 4,
  totalRevenue: 6932.53,
  revenueChange: 12.5,
  ordersChange: -8.3,
};

// Mock tenants for multi-tenant support
export const mockTenants = [
  {
    id: 'tenant-1',
    name: 'North American Warehouse',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NAW&backgroundColor=3b82f6',
    subscription: 'enterprise',
    environments: [
      {
        id: 'env-1-prod',
        name: 'Production',
        type: 'production',
        url: 'https://na-prod.inventory.com',
        status: 'active',
        dbSyncStatus: 'synced',
        lastSyncAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: 'env-1-staging',
        name: 'Staging',
        type: 'staging',
        url: 'https://na-staging.inventory.com',
        status: 'active',
        dbSyncStatus: 'synced',
        lastSyncAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: 'env-1-dev',
        name: 'Development',
        type: 'development',
        url: 'https://na-dev.inventory.com',
        status: 'active',
        dbSyncStatus: 'syncing',
      },
    ],
    createdAt: '2023-06-15T10:00:00Z',
  },
  {
    id: 'tenant-2',
    name: 'European Distribution Center',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EDC&backgroundColor=8b5cf6',
    subscription: 'enterprise',
    environments: [
      {
        id: 'env-2-prod',
        name: 'EU Production',
        type: 'production',
        url: 'https://eu-prod.inventory.com',
        status: 'active',
        dbSyncStatus: 'synced',
        lastSyncAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: 'env-2-staging',
        name: 'EU Staging',
        type: 'staging',
        url: 'https://eu-staging.inventory.com',
        status: 'maintenance',
        dbSyncStatus: 'offline',
      },
    ],
    createdAt: '2023-08-20T14:30:00Z',
  },
  {
    id: 'tenant-3',
    name: 'Asia-Pacific Hub',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=APH&backgroundColor=10b981',
    subscription: 'pro',
    environments: [
      {
        id: 'env-3-prod',
        name: 'APAC Production',
        type: 'production',
        url: 'https://apac-prod.inventory.com',
        status: 'active',
        dbSyncStatus: 'synced',
        lastSyncAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: '2023-11-05T09:15:00Z',
  },
  {
    id: 'tenant-4',
    name: 'Training & Sandbox',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TS&backgroundColor=f59e0b',
    subscription: 'free',
    environments: [
      {
        id: 'env-4-sandbox',
        name: 'Sandbox',
        type: 'development',
        url: 'https://sandbox.inventory.com',
        status: 'active',
        dbSyncStatus: 'error',
        lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: '2024-01-10T11:00:00Z',
  },
];

// Mock user tenant roles
export const mockUserTenantRoles = [
  {
    tenantId: 'tenant-1',
    role: 'Admin',
    permissions: ['read', 'write', 'delete', 'manage_users'],
  },
  {
    tenantId: 'tenant-2',
    role: 'Staff',
    permissions: ['read', 'write'],
  },
  {
    tenantId: 'tenant-3',
    role: 'Viewer',
    permissions: ['read'],
  },
  {
    tenantId: 'tenant-4',
    role: 'Admin',
    permissions: ['read', 'write', 'delete', 'manage_users'],
  },
];

// Mock Purchase Orders
export const mockPurchaseOrders = [
  {
    id: 'PO-1',
    poNumber: 'PO-2024-001',
    supplierId: '1',
    supplierName: 'TechSupply Co.',
    items: [
      {
        productId: '1',
        productName: 'Wireless Mouse',
        quantity: 50,
        unitPrice: 15.99,
        total: 799.50
      },
      {
        productId: '2',
        productName: 'USB-C Cable',
        quantity: 100,
        unitPrice: 5.99,
        total: 599.00
      }
    ],
    total: 1398.50,
    status: 'Received',
    orderDate: '2024-01-15T10:00:00Z',
    expectedDate: '2024-01-25T10:00:00Z',
    receivedDate: '2024-01-24T14:30:00Z',
    notes: 'Bulk order for Q1 stock',
    createdBy: 'Admin User'
  },
  {
    id: 'PO-2',
    poNumber: 'PO-2024-002',
    supplierId: '2',
    supplierName: 'GameGear Ltd.',
    items: [
      {
        productId: '3',
        productName: 'Mechanical Keyboard',
        quantity: 25,
        unitPrice: 45.50,
        total: 1137.50
      }
    ],
    total: 1137.50,
    status: 'Approved',
    orderDate: '2024-02-01T09:00:00Z',
    expectedDate: '2024-02-15T09:00:00Z',
    notes: 'Gaming keyboards - high demand',
    createdBy: 'Staff User'
  },
  {
    id: 'PO-3',
    poNumber: 'PO-2024-003',
    supplierId: '3',
    supplierName: 'OfficeMax Corp.',
    items: [
      {
        productId: '4',
        productName: 'Office Chair',
        quantity: 15,
        unitPrice: 89.00,
        total: 1335.00
      },
      {
        productId: '7',
        productName: 'Pen Set (12 pcs)',
        quantity: 50,
        unitPrice: 3.99,
        total: 199.50
      }
    ],
    total: 1534.50,
    status: 'Pending',
    orderDate: '2024-02-05T11:00:00Z',
    expectedDate: '2024-02-20T11:00:00Z',
    createdBy: 'Admin User'
  }
];

// Mock Customers
export const mockCustomers = [
  {
    id: 'CUST-1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0101',
    company: 'TechCorp Industries',
    address: '123 Business Ave',
    city: 'New York',
    country: 'USA',
    totalOrders: 12,
    totalSpent: 5670.50,
    createdAt: '2023-06-15T10:00:00Z',
    lastOrderDate: '2024-02-01T14:30:00Z',
    status: 'Active'
  },
  {
    id: 'CUST-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@startuplab.io',
    phone: '+1-555-0102',
    company: 'StartupLab',
    address: '456 Innovation Blvd',
    city: 'San Francisco',
    country: 'USA',
    totalOrders: 8,
    totalSpent: 3240.75,
    createdAt: '2023-08-20T09:30:00Z',
    lastOrderDate: '2024-01-28T10:15:00Z',
    status: 'Active'
  },
  {
    id: 'CUST-3',
    name: 'Michael Chen',
    email: 'mchen@globaltech.com',
    phone: '+1-555-0103',
    company: 'Global Tech Solutions',
    address: '789 Enterprise St',
    city: 'Austin',
    country: 'USA',
    totalOrders: 15,
    totalSpent: 8920.00,
    createdAt: '2023-05-10T11:00:00Z',
    lastOrderDate: '2024-02-03T16:45:00Z',
    status: 'Active'
  },
  {
    id: 'CUST-4',
    name: 'Emily Rodriguez',
    email: 'emily.r@designstudio.co',
    phone: '+1-555-0104',
    company: 'Creative Design Studio',
    address: '321 Art District',
    city: 'Los Angeles',
    country: 'USA',
    totalOrders: 5,
    totalSpent: 1850.25,
    createdAt: '2023-11-05T14:20:00Z',
    lastOrderDate: '2024-01-15T09:30:00Z',
    status: 'Active'
  },
  {
    id: 'CUST-5',
    name: 'David Lee',
    email: 'david.lee@retailplus.com',
    phone: '+1-555-0105',
    address: '555 Commerce Way',
    city: 'Chicago',
    country: 'USA',
    totalOrders: 2,
    totalSpent: 450.00,
    createdAt: '2024-01-20T13:00:00Z',
    status: 'Inactive'
  }
];

// Mock Stock Adjustments
export const mockStockAdjustments = [
  {
    id: 'ADJ-1',
    productId: '2',
    productName: 'USB-C Cable',
    adjustmentType: 'decrease',
    quantity: 5,
    reason: 'Damage',
    notes: 'Water damage during storage',
    performedBy: 'Staff User',
    date: '2024-02-01T10:30:00Z',
    reference: 'DMG-2024-001'
  },
  {
    id: 'ADJ-2',
    productId: '1',
    productName: 'Wireless Mouse',
    adjustmentType: 'increase',
    quantity: 3,
    reason: 'Found',
    notes: 'Found in warehouse back storage',
    performedBy: 'Admin User',
    date: '2024-02-02T14:15:00Z'
  },
  {
    id: 'ADJ-3',
    productId: '3',
    productName: 'Mechanical Keyboard',
    adjustmentType: 'decrease',
    quantity: 2,
    reason: 'Loss',
    notes: 'Missing after inventory count',
    performedBy: 'Staff User',
    date: '2024-02-03T09:00:00Z',
    reference: 'LOSS-2024-001'
  },
  {
    id: 'ADJ-4',
    productId: '7',
    productName: 'Pen Set (12 pcs)',
    adjustmentType: 'increase',
    quantity: 10,
    reason: 'Recount',
    notes: 'Physical count showed higher quantity',
    performedBy: 'Admin User',
    date: '2024-02-04T11:30:00Z'
  },
  {
    id: 'ADJ-5',
    productId: '4',
    productName: 'Office Chair',
    adjustmentType: 'decrease',
    quantity: 1,
    reason: 'Return',
    notes: 'Customer return - defective',
    performedBy: 'Staff User',
    date: '2024-02-05T15:45:00Z',
    reference: 'RET-2024-012'
  }
];

// Mock Invoices
export const mockInvoices = [
  {
    id: 'INV-1',
    invoiceNumber: 'INV-2024-001',
    orderId: '1',
    customerId: 'CUST-1',
    customerName: 'John Smith',
    items: [
      {
        productId: '1',
        productName: 'Wireless Mouse',
        quantity: 5,
        unitPrice: 29.99,
        tax: 12.00,
        total: 162.95
      }
    ],
    subtotal: 149.95,
    tax: 12.00,
    total: 161.95,
    status: 'Paid',
    issueDate: '2024-01-15T10:00:00Z',
    dueDate: '2024-02-15T10:00:00Z',
    paidDate: '2024-01-20T14:30:00Z',
    paymentMethod: 'Credit Card',
    notes: 'Thank you for your business!'
  },
  {
    id: 'INV-2',
    invoiceNumber: 'INV-2024-002',
    orderId: '2',
    customerId: 'CUST-2',
    customerName: 'Sarah Johnson',
    items: [
      {
        productId: '3',
        productName: 'Mechanical Keyboard',
        quantity: 2,
        unitPrice: 89.99,
        tax: 14.40,
        total: 194.38
      },
      {
        productId: '2',
        productName: 'USB-C Cable',
        quantity: 10,
        unitPrice: 12.99,
        tax: 10.39,
        total: 140.29
      }
    ],
    subtotal: 309.88,
    tax: 24.79,
    total: 334.67,
    status: 'Sent',
    issueDate: '2024-01-28T09:00:00Z',
    dueDate: '2024-02-28T09:00:00Z',
    notes: 'Net 30 payment terms'
  },
  {
    id: 'INV-3',
    invoiceNumber: 'INV-2024-003',
    orderId: '3',
    customerId: 'CUST-3',
    customerName: 'Michael Chen',
    items: [
      {
        productId: '4',
        productName: 'Office Chair',
        quantity: 10,
        unitPrice: 199.99,
        tax: 160.00,
        total: 2159.90
      }
    ],
    subtotal: 1999.90,
    tax: 160.00,
    total: 2159.90,
    status: 'Paid',
    issueDate: '2024-02-01T11:00:00Z',
    dueDate: '2024-03-01T11:00:00Z',
    paidDate: '2024-02-05T10:15:00Z',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'INV-4',
    invoiceNumber: 'INV-2024-004',
    customerId: 'CUST-4',
    customerName: 'Emily Rodriguez',
    items: [
      {
        productId: '6',
        productName: 'Gaming Headset',
        quantity: 3,
        unitPrice: 79.99,
        tax: 19.20,
        total: 259.17
      }
    ],
    subtotal: 239.97,
    tax: 19.20,
    total: 259.17,
    status: 'Overdue',
    issueDate: '2024-01-05T14:00:00Z',
    dueDate: '2024-02-05T14:00:00Z',
    notes: 'Payment overdue - please remit'
  },
  {
    id: 'INV-5',
    invoiceNumber: 'INV-2024-005',
    customerId: 'CUST-1',
    customerName: 'John Smith',
    items: [
      {
        productId: '7',
        productName: 'Pen Set (12 pcs)',
        quantity: 20,
        unitPrice: 7.99,
        tax: 12.78,
        total: 172.58
      }
    ],
    subtotal: 159.80,
    tax: 12.78,
    total: 172.58,
    status: 'Draft',
    issueDate: '2024-02-07T10:00:00Z',
    dueDate: '2024-03-07T10:00:00Z'
  }
];

export const mockLowStockAlerts = [
  {
    id: 'ALERT-1',
    productId: '2',
    productName: 'USB-C Cable',
    sku: 'UC-002',
    currentStock: 12,
    minStockLevel: 30,
    reorderPoint: 35,
    priority: 'Critical',
    status: 'Active',
    createdAt: '2024-02-02T11:20:00Z',
    createdBy: 'System'
  },
  {
    id: 'ALERT-2',
    productId: '8',
    productName: 'Stapler',
    sku: 'ST-008',
    currentStock: 8,
    minStockLevel: 15,
    reorderPoint: 20,
    priority: 'High',
    status: 'Active',
    createdAt: '2024-02-01T08:30:00Z',
    createdBy: 'System'
  },
  {
    id: 'ALERT-3',
    productId: '6',
    productName: 'Spiral Notebook',
    sku: 'NB-006',
    currentStock: 35,
    minStockLevel: 50,
    reorderPoint: 60,
    priority: 'Medium',
    status: 'Acknowledged',
    createdAt: '2024-01-28T14:00:00Z',
    createdBy: 'System',
    acknowledgedAt: '2024-01-29T09:00:00Z',
    acknowledgedBy: 'John Doe',
    suggestedOrderQuantity: 100
  },
  {
    id: 'ALERT-4',
    productId: '4',
    productName: 'Desk Lamp',
    sku: 'DL-004',
    currentStock: 14,
    minStockLevel: 10,
    reorderPoint: 15,
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2024-01-20T10:00:00Z',
    createdBy: 'System',
    acknowledgedAt: '2024-01-21T11:00:00Z',
    acknowledgedBy: 'John Doe',
    resolvedAt: '2024-01-25T15:00:00Z',
    resolvedBy: 'Jane Smith',
    suggestedOrderQuantity: 50,
    purchaseOrderId: 'PO-2024-004'
  }
];

export const mockReturns = [
  {
    id: 'RET-1',
    returnNumber: 'RET-2024-001',
    type: 'Customer',
    customerId: 'CUST-2',
    customerName: 'Sarah Johnson',
    items: [
      {
        productId: '3',
        productName: 'Mechanical Keyboard',
        sku: 'KB-003',
        quantity: 1,
        unitPrice: 89.99,
        reason: 'Defective - keys not working'
      }
    ],
    totalAmount: 89.99,
    refundAmount: 89.99,
    refundMethod: 'Original Payment',
    refundStatus: 'Completed',
    status: 'Completed',
    reason: 'Defective Product',
    createdAt: '2024-02-01T14:30:00Z',
    createdBy: 'Sarah Johnson',
    approvedAt: '2024-02-02T09:00:00Z',
    approvedBy: 'John Doe',
    completedAt: '2024-02-02T15:00:00Z'
  },
  {
    id: 'RET-2',
    returnNumber: 'RET-2024-002',
    type: 'Supplier',
    supplierId: 'SUP-1',
    supplierName: 'TechSupply Co.',
    items: [
      {
        productId: '1',
        productName: 'Wireless Mouse',
        sku: 'WM-001',
        quantity: 10,
        unitPrice: 15.99,
        reason: 'Received damaged units'
      }
    ],
    totalAmount: 159.90,
    refundAmount: 159.90,
    refundMethod: 'Store Credit',
    refundStatus: 'Pending',
    status: 'Approved',
    reason: 'Damaged',
    createdAt: '2024-02-03T10:00:00Z',
    createdBy: 'John Doe',
    approvedAt: '2024-02-03T16:00:00Z',
    approvedBy: 'Jane Smith'
  },
  {
    id: 'RET-3',
    returnNumber: 'RET-2024-003',
    type: 'Customer',
    customerId: 'CUST-1',
    customerName: 'John Smith',
    items: [
      {
        productId: '5',
        productName: 'Phone Stand',
        sku: 'PS-005',
        quantity: 2,
        unitPrice: 12.99,
        reason: 'Changed mind'
      }
    ],
    totalAmount: 25.98,
    refundAmount: 20.78,
    refundMethod: 'Original Payment',
    refundStatus: 'Pending',
    status: 'Pending',
    reason: 'Customer Request',
    createdAt: '2024-02-05T11:00:00Z',
    createdBy: 'John Smith',
    restockingFee: 5.20
  },
  {
    id: 'RET-4',
    returnNumber: 'RET-2024-004',
    type: 'Customer',
    customerId: 'CUST-3',
    customerName: 'Michael Brown',
    items: [
      {
        productId: '8',
        productName: 'Stapler',
        sku: 'ST-008',
        quantity: 1,
        unitPrice: 9.99,
        reason: 'Wrong item shipped'
      }
    ],
    totalAmount: 9.99,
    refundAmount: 9.99,
    refundMethod: 'Store Credit',
    refundStatus: 'N/A',
    status: 'Rejected',
    reason: 'Wrong Item',
    createdAt: '2024-02-04T13:00:00Z',
    createdBy: 'Michael Brown',
    rejectedAt: '2024-02-04T17:00:00Z',
    rejectedBy: 'John Doe',
    rejectionReason: 'Return period expired'
  }
];

export const mockUsers = [
  {
    id: 'USER-1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    phone: '+1 234 567 8900',
    department: 'Operations',
    position: 'Warehouse Manager',
    status: 'Active',
    createdAt: '2023-01-15T10:00:00Z',
    createdBy: 'System'
  },
  {
    id: 'USER-2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Staff',
    phone: '+1 234 567 8901',
    department: 'Inventory',
    position: 'Inventory Coordinator',
    status: 'Active',
    createdAt: '2023-02-20T09:00:00Z',
    createdBy: 'John Doe'
  },
  {
    id: 'USER-3',
    name: 'Bob Wilson',
    email: 'bob.wilson@company.com',
    role: 'Staff',
    phone: '+1 234 567 8902',
    department: 'Purchasing',
    position: 'Purchasing Agent',
    status: 'Active',
    createdAt: '2023-03-10T14:00:00Z',
    createdBy: 'John Doe'
  },
  {
    id: 'USER-4',
    name: 'Alice Chen',
    email: 'alice.chen@company.com',
    role: 'Viewer',
    phone: '+1 234 567 8903',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'Active',
    createdAt: '2023-04-05T11:00:00Z',
    createdBy: 'John Doe'
  },
  {
    id: 'USER-5',
    name: 'David Lee',
    email: 'david.lee@company.com',
    role: 'Staff',
    phone: '+1 234 567 8904',
    department: 'Operations',
    position: 'Warehouse Associate',
    status: 'Inactive',
    createdAt: '2023-05-12T08:00:00Z',
    createdBy: 'John Doe',
    lastModifiedAt: '2024-01-15T10:00:00Z',
    lastModifiedBy: 'Jane Smith'
  }
];

export const mockLocations = [
  {
    id: 'LOC-1',
    code: 'WH-001',
    name: 'Main Warehouse',
    type: 'Warehouse',
    address: '123 Industrial Drive, City, State 12345',
    currentStock: 1250,
    maxCapacity: 2000,
    status: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'System'
  },
  {
    id: 'LOC-2',
    code: 'WH-002',
    name: 'North Warehouse',
    type: 'Warehouse',
    address: '456 Commerce Blvd, City, State 12346',
    currentStock: 850,
    maxCapacity: 1500,
    status: 'Active',
    createdAt: '2023-06-01T00:00:00Z',
    createdBy: 'John Doe'
  },
  {
    id: 'LOC-3',
    code: 'WH-001-A',
    name: 'Zone A',
    type: 'Zone',
    parentLocationId: 'LOC-1',
    currentStock: 450,
    maxCapacity: 600,
    status: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'System'
  },
  {
    id: 'LOC-4',
    code: 'WH-001-B',
    name: 'Zone B',
    type: 'Zone',
    parentLocationId: 'LOC-1',
    currentStock: 800,
    maxCapacity: 800,
    status: 'Full',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'System'
  },
  {
    id: 'LOC-5',
    code: 'WH-001-A-01',
    name: 'Aisle 1',
    type: 'Aisle',
    parentLocationId: 'LOC-3',
    currentStock: 150,
    maxCapacity: 200,
    status: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'System'
  },
  {
    id: 'LOC-6',
    code: 'WH-001-A-01-A',
    name: 'Bin A',
    type: 'Bin',
    parentLocationId: 'LOC-5',
    currentStock: 45,
    maxCapacity: 50,
    status: 'Active',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'System',
    description: 'Small parts storage'
  },
  {
    id: 'LOC-7',
    code: 'WH-003',
    name: 'South Distribution Center',
    type: 'Warehouse',
    address: '789 Logistics Way, City, State 12347',
    currentStock: 0,
    maxCapacity: 3000,
    status: 'Inactive',
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'John Doe',
    description: 'New facility - not yet operational'
  }
];

export const mockStockTransfers = [
  {
    id: 'TRF-1',
    transferNumber: 'TRF-240201',
    fromLocationId: 'LOC-1',
    fromLocationName: 'Main Warehouse',
    toLocationId: 'LOC-2',
    toLocationName: 'North Warehouse',
    items: [
      {
        productId: '1',
        productName: 'Wireless Mouse',
        sku: 'WM-001',
        quantity: 20
      },
      {
        productId: '2',
        productName: 'USB-C Cable',
        sku: 'UC-002',
        quantity: 50
      }
    ],
    totalQuantity: 70,
    status: 'Received',
    createdAt: '2024-02-01T10:00:00Z',
    createdBy: 'John Doe',
    approvedAt: '2024-02-01T11:00:00Z',
    approvedBy: 'Jane Smith',
    shippedAt: '2024-02-01T14:00:00Z',
    receivedAt: '2024-02-02T09:00:00Z',
    receivedBy: 'Bob Wilson',
    notes: 'Regular stock rebalancing'
  },
  {
    id: 'TRF-2',
    transferNumber: 'TRF-240203',
    fromLocationId: 'LOC-2',
    fromLocationName: 'North Warehouse',
    toLocationId: 'LOC-1',
    toLocationName: 'Main Warehouse',
    items: [
      {
        productId: '7',
        productName: 'Pen Set (12 pcs)',
        sku: 'PN-007',
        quantity: 30
      }
    ],
    totalQuantity: 30,
    status: 'In Transit',
    createdAt: '2024-02-03T08:00:00Z',
    createdBy: 'Bob Wilson',
    approvedAt: '2024-02-03T09:00:00Z',
    approvedBy: 'John Doe',
    shippedAt: '2024-02-03T13:00:00Z',
    notes: 'Rush transfer for customer order'
  },
  {
    id: 'TRF-3',
    transferNumber: 'TRF-240204',
    fromLocationId: 'LOC-1',
    fromLocationName: 'Main Warehouse',
    toLocationId: 'LOC-3',
    toLocationName: 'Zone A',
    items: [
      {
        productId: '4',
        productName: 'Desk Lamp',
        sku: 'DL-004',
        quantity: 15
      },
      {
        productId: '5',
        productName: 'Phone Stand',
        sku: 'PS-005',
        quantity: 25
      }
    ],
    totalQuantity: 40,
    status: 'Approved',
    createdAt: '2024-02-04T10:00:00Z',
    createdBy: 'Jane Smith',
    approvedAt: '2024-02-04T11:30:00Z',
    approvedBy: 'John Doe'
  },
  {
    id: 'TRF-4',
    transferNumber: 'TRF-240205',
    fromLocationId: 'LOC-3',
    fromLocationName: 'Zone A',
    toLocationId: 'LOC-4',
    toLocationName: 'Zone B',
    items: [
      {
        productId: '6',
        productName: 'Spiral Notebook',
        sku: 'NB-006',
        quantity: 100
      }
    ],
    totalQuantity: 100,
    status: 'Pending',
    createdAt: '2024-02-05T14:00:00Z',
    createdBy: 'Bob Wilson',
    notes: 'Zone rebalancing needed'
  },
  {
    id: 'TRF-5',
    transferNumber: 'TRF-240131',
    fromLocationId: 'LOC-1',
    fromLocationName: 'Main Warehouse',
    toLocationId: 'LOC-2',
    toLocationName: 'North Warehouse',
    items: [
      {
        productId: '3',
        productName: 'Mechanical Keyboard',
        sku: 'KB-003',
        quantity: 5
      }
    ],
    totalQuantity: 5,
    status: 'Cancelled',
    createdAt: '2024-01-31T09:00:00Z',
    createdBy: 'Jane Smith',
    notes: 'Cancelled due to inventory discrepancy'
  }
];
