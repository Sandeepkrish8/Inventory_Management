# Inventory Management System UI

A comprehensive, role-based web application for managing inventory, products, orders, suppliers, and analytics. Built with React, TypeScript, Tailwind CSS, and modern UI components.

**Original Design:** [Figma Design File](https://www.figma.com/design/03Pu1CrfYqdCpkX85pIkah/Inventory-Management-System-UI)

---

## 🎯 Features

### Core Functionality
- **Dashboard** - Real-time overview with key metrics, revenue trends, and stock status visualization
- **Product Management** - Full product catalog with SKU, pricing, stock levels, and supplier tracking
- **Order Processing** - Create, manage, and track customer orders with multiple status states
- **Inventory Transactions** - Complete audit trail of all stock movements (inbound/outbound)
- **Supplier Management** - Maintain supplier relationships and contact information
- **Category Management** - Organize products into categories with inventory counts
- **Analytics & Reporting** - Visual data representation with interactive charts and KPIs

### Security & Access Control
- **Role-Based Access Control (RBAC)** - Three user roles with different permissions:
  - **Admin** - Full system access and configuration
  - **Staff** - Core operational access (products, orders, transactions)
  - **Viewer** - Read-only access to reports and dashboards
- **Authentication** - Secure login/logout with session management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Git (optional, for cloning)

### Installation

1. **Clone or extract the project:**
   ```bash
   git clone <repository-url>
   cd "Inventory Management System UI"
   ```

2. **Install dependencies:**
   ```bash
   npm i
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the port shown in terminal)

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # UI Pages and Components
│   │   ├── Dashboard.tsx            # Main dashboard view
│   │   ├── ProductsPage.tsx         # Product inventory management
│   │   ├── OrdersPage.tsx           # Order management interface
│   │   ├── TransactionsPage.tsx     # Stock transaction history
│   │   ├── SuppliersPage.tsx        # Supplier directory
│   │   ├── CategoriesPage.tsx       # Product categories
│   │   ├── AnalyticsPage.tsx        # Analytics & reporting
│   │   ├── LoginPage.tsx            # Authentication entry point
│   │   ├── DashboardLayout.tsx      # Main layout wrapper
│   │   ├── QuickStats.tsx           # Dashboard statistics widget
│   │   ├── EnhancedProductCard.tsx  # Product display card
│   │   ├── ui/                      # Reusable UI components (50+ Radix UI components)
│   │   └── figma/                   # Figma-integrated components
│   ├── contexts/
│   │   └── AuthContext.tsx          # Authentication state management
│   ├── data/
│   │   └── mockData.ts              # Mock data for development
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── App.tsx                      # Main application component
├── styles/
│   ├── index.css                    # Main stylesheet
│   ├── tailwind.css                 # Tailwind CSS config
│   ├── theme.css                    # Theme variables
│   └── fonts.css                    # Font definitions
└── main.tsx                         # Application entry point

Configuration Files:
├── vite.config.ts                   # Vite build configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs               # PostCSS configuration
├── tailwind.config.js (implicit)    # Tailwind CSS configuration
└── tsconfig.json (implicit)         # TypeScript configuration
```

---

## 🧩 Component Documentation

### Main Page Components

| Component | File | Purpose | Description |
|-----------|------|---------|-------------|
| **Dashboard** | `Dashboard.tsx` | Home/overview page | Displays KPIs, revenue trends, category distribution, stock status alerts, and quick actions |
| **LoginPage** | `LoginPage.tsx` | Authentication | Role-based login interface with mock authentication |
| **ProductsPage** | `ProductsPage.tsx` | Product management | View, search, filter, and manage product inventory with bulk actions |
| **OrdersPage** | `OrdersPage.tsx` | Order management | Create, view, and process customer orders with status tracking |
| **TransactionsPage** | `TransactionsPage.tsx` | Stock audit trail | Historical record of all inventory movements (stock in/out) |
| **SuppliersPage** | `SuppliersPage.tsx` | Supplier directory | Manage supplier information, contact details, and relationships |
| **CategoriesPage** | `CategoriesPage.tsx` | Category management | Organize and manage product categories with inventory counts |
| **AnalyticsPage** | `AnalyticsPage.tsx` | Reporting & insights | Advanced analytics with charts, trends, and custom reports |
| **DashboardLayout** | `DashboardLayout.tsx` | Main layout | Sidebar navigation, header, and responsive layout wrapper |
| **QuickStats** | `QuickStats.tsx` | Dashboard widget | Compact metric cards showing key performance indicators |
| **EnhancedProductCard** | `EnhancedProductCard.tsx` | Product display | Reusable product card with image, details, and actions |

### UI Component Library

**50+ Radix UI Components** available in `src/app/components/ui/`:

| Category | Components |
|----------|-----------|
| **Forms** | Input, Textarea, Select, Checkbox, Radio Group, Toggle, Switch, Label, Form |
| **Feedback** | Alert, Alert Dialog, Toast (Sonner), Progress, Skeleton |
| **Navigation** | Navigation Menu, Breadcrumb, Pagination, Sidebar, Tabs, Menubar |
| **Modals** | Dialog, Drawer, Popover, Hover Card |
| **Data Display** | Table, Badge, Card, Avatar, Separator, Scroll Area |
| **Interaction** | Button, Dropdown Menu, Context Menu, Toggle Group |
| **Other** | Accordion, Carousel, Calendar, Command, Collapsible, AspectRatio, Resizable, InputOTP |

---

## 🔐 Authentication System

### Current Implementation

The authentication system uses React Context API for state management:

```typescript
// useAuth hook - Use anywhere in your app
const { user, login, logout, isAuthenticated } = useAuth();

// AuthProvider wrapper - Wrap your app with AuthProvider
<AuthProvider>
  <App />
</AuthProvider>
```

### User Roles

```typescript
type UserRole = 'Admin' | 'Staff' | 'Viewer';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
```

### Mock Login

Currently uses mock authentication with simulated API delay:
- Email: any value
- Password: any value
- Role: Select from Admin, Staff, or Viewer
- Response time: 500ms (simulated API latency)

### Integrating Real Backend Authentication

1. **Update the `login` function in** `AuthContext.tsx`:

```typescript
const login = async (email: string, password: string, role: UserRole) => {
  try {
    // Replace with your actual API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const userData = await response.json();
    setUser(userData);
    // Store token in localStorage if needed
    localStorage.setItem('authToken', userData.token);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

2. **Implement logout with token cleanup:**

```typescript
const logout = () => {
  setUser(null);
  localStorage.removeItem('authToken');
};
```

3. **Add token persistence:**

```typescript
// On app initialization, restore user session if token exists
useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Verify token with backend
    verifyToken(token);
  }
}, []);
```

---

## 📊 Data Types & Models

### User & Authentication
```typescript
type UserRole = 'Admin' | 'Staff' | 'Viewer';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
```

### Products & Inventory
```typescript
interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  description: string;
  price: number;
  cost: number;
  quantity: number;
  reorderLevel: number;
  supplierId: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  productCount: number;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  productCount: number;
}
```

### Orders & Transactions
```typescript
type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';
type TransactionType = 'stock_in' | 'stock_out';

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderId: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

interface Transaction {
  id: string;
  productId: string;
  type: TransactionType;
  quantity: number;
  date: string;
  reference: string;
}
```

### Reporting
```typescript
interface DashboardMetrics {
  totalProducts: number;
  lowStockAlerts: number;
  pendingOrders: number;
  monthlyRevenue: number;
  chartData: Array<{ name: string; value: number }>;
}
```

---

## 🎨 Styling & Theming

### Framework: Tailwind CSS 4.1.12

#### CSS Files

| File | Purpose |
|------|---------|
| `styles/index.css` | Main stylesheet and global styles |
| `styles/tailwind.css` | Tailwind CSS configuration and layers |
| `styles/theme.css` | CSS custom properties (variables) for theming |
| `styles/fonts.css` | Font definitions and imports |

#### Customizing Theme

Edit `styles/theme.css` to modify color scheme, spacing, typography:

```css
:root {
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --secondary: #6366f1;
  --background: #ffffff;
  --foreground: #020817;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  /* ... more variables */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #020817;
    --foreground: #f8fafc;
    /* ... dark mode variables */
  }
}
```

#### Using Tailwind Classes

All components use Tailwind utility classes:

```tsx
<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
  <h2 className="text-lg font-semibold text-gray-900">Products</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
    Add Product
  </button>
</div>
```

---

## 📦 Dependencies

### Core Framework
- **react** (18.3.1) - UI library
- **react-dom** (18.3.1) - React DOM rendering
- **typescript** - Type safety

### Build & Development
- **vite** (6.3.5) - Fast build tool and dev server
- **@vitejs/plugin-react** - Vite React plugin
- **tailwindcss** (4.1.12) - CSS framework
- **postcss** - CSS processing

### UI Components & Libraries
- **@radix-ui/** (v1.1-v2.1) - Unstyled, accessible component primitives
- **@mui/material, @mui/icons-material** - Material Design components
- **lucide-react** (0.487.0) - Icon library
- **recharts** (2.15.2) - React charting library
- **sonner** (2.0.3) - Toast notifications

### Forms & Input
- **react-hook-form** (7.55.0) - Performant form management
- **react-day-picker** (8.10.1) - Date picker
- **input-otp** (1.4.2) - One-time password input
- **date-fns** (3.6.0) - Date utilities

### Advanced Features
- **react-dnd** (16.0.1) - Drag and drop
- **embla-carousel** (8.6.0) - Carousel component
- **next-themes** (0.4.6) - Theme management
- **react-resizable-panels** (2.1.7) - Resizable layout
- **motion** (12.23.24) - Animation library
- **vaul** (1.2.0) - Drawer/sheet component

### Utilities
- **clsx** (2.1.1) - Conditional className utility
- **tailwind-merge** (3.2.0) - Merge Tailwind classes
- **class-variance-authority** - CSS-in-JS utility

---

## 🔧 API Integration Guide

### Mock Data Setup

The app uses mock data from `src/app/data/mockData.ts` for development. This includes:
- Sample products with pricing and stock information
- Customer orders with line items
- Inventory transactions
- Supplier information
- Categories

### Replacing Mock Data with Backend API

1. **Create an API service layer:**

```typescript
// src/app/services/api.ts
const API_BASE_URL = 'https://your-api.com/api';

export const productService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },
  
  create: async (data: Omit<Product, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  update: async (id: string, data: Partial<Product>) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  delete: async (id: string) => {
    await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
  }
};
```

2. **Use in components:**

```typescript
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
  
  fetchProducts();
}, []);
```

3. **Expected Backend Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| GET | `/api/transactions` | List transactions |
| GET | `/api/suppliers` | List suppliers |
| GET | `/api/categories` | List categories |
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/logout` | User logout |

---

## 🏗️ Building & Deployment

### Development Build

```bash
npm run dev
```

- Starts Vite development server at `http://localhost:5173`
- Includes hot module replacement (HMR)
- Source maps enabled for debugging
- Full TypeScript checking

### Production Build

```bash
npm run build
```

- Optimizes all code and assets
- Generates `dist/` directory with production-ready files
- Minified JavaScript and CSS
- Tree-shaking removes unused code
- Assets are hashed for caching

### Testing Production Build Locally

```bash
npm run build
npx vite preview
```

Opens production build at `http://localhost:4173`

### Deployment Options

#### Vercel (Recommended for React/Vite)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Vercel auto-detects Vite and builds accordingly
4. Deploy with one click

#### Netlify
1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

#### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Traditional Server (Apache, Nginx)
1. Run `npm run build`
2. Upload `dist/` contents to web server
3. Configure server to serve `index.html` for all routes (SPA routing)

**Nginx Configuration Example:**
```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/inventory-app/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Dependencies Installation Fails
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm i
```

### Build Fails with TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Auto-fix some issues
npm run build
```

### Tailwind Styles Not Applied
- Verify `tailwind.config.js` includes content paths
- Ensure CSS file imports Tailwind directives
- Clear browser cache and rebuild
- Check that build included all CSS files

### Components Not Rendering
- Check browser console for errors
- Verify component props match expected types
- Ensure AuthProvider wraps the app
- Check that import paths are correct

### HMR Not Working in Development
- Ensure Vite dev server is running (`npm run dev`)
- Check that file changes are being detected
- Restart dev server if unresponsive
- Check firewall/network settings

---

## 📝 Contributing

### Code Style
- Use TypeScript for type safety
- Follow React functional component patterns
- Use Tailwind CSS classes for styling (avoid inline styles)
- Prefer composition over inheritance
- Keep components focused and reusable

### Adding New Components
1. Create component in `src/app/components/`
2. Use existing UI components from `src/app/components/ui/`
3. Follow naming conventions (PascalCase for components)
4. Add TypeScript interfaces for props
5. Document component purpose in comments

### Workflow
1. Create a new branch for features
2. Make changes incrementally with clear commits
3. Test thoroughly before submitting
4. Update documentation as needed

---

## 📄 License & Attribution

See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for complete package attributions and licenses.

**Original Design:** [Figma - Inventory Management System UI](https://www.figma.com/design/03Pu1CrfYqdCpkX85pIkah/Inventory-Management-System-UI)

---

## 🤝 Support

For issues or questions:
1. Check [Guidelines.md](guidelines/Guidelines.md) for standards
2. Review existing component implementations
3. Check component documentation in this README
4. Consult original Figma design for UI reference

---

**Happy coding!** 🚀
#   I n v e n t o r y _ M a n a g e m e n t  
 