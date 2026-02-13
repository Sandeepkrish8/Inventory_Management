# Professional UI Components - Usage Guide

## 🎯 Quick Start

All new professional components are now integrated and ready to use! Here's what's been added:

---

## ✨ New Components

### 1. **Command Palette** (`CommandPalette.tsx`)
**Keyboard Shortcut:** `⌘K` or `Ctrl+K`

**Features:**
- Quick navigation to any page
- Action shortcuts (Add Product, Export, etc.)
- Search across all commands
- Keyboard-first interface

**Usage:**
```tsx
import { CommandPalette } from '@/app/components/CommandPalette';

<CommandPalette onNavigate={(page) => console.log(page)} />
```

**How to Use:**
- Press `⌘K` (Mac) or `Ctrl+K` (Windows) anywhere in the app
- Type to search for pages or actions
- Use arrow keys to navigate
- Press Enter to execute

**Location:** Already integrated in DashboardLayout - works globally!

---

### 2. **Keyboard Shortcuts Help** (`KeyboardShortcutsHelp.tsx`)
**Keyboard Shortcut:** `?` (question mark)

**Features:**
- Comprehensive shortcut reference
- Grouped by category (Navigation, Actions, Selection, General)
- Visual keyboard representations
- Dark mode support

**Usage:**
```tsx
import { KeyboardShortcutsHelp } from '@/app/components/KeyboardShortcutsHelp';

<KeyboardShortcutsHelp />
```

**Available Shortcuts:**
- `⌘K` - Command Palette
- `⌘D` - Dashboard
- `⌘P` - Products
- `⌘O` - Orders
- `⌘A` - Analytics
- `?` - Show shortcuts help
- `ESC` - Close modals

**Location:** Already integrated in DashboardLayout - press `?` anywhere!

---

### 3. **Breadcrumbs Navigation** (`Breadcrumbs.tsx`)

**Features:**
- Contextual navigation path
- Icon support
- Click to navigate
- Responsive design
- Active state highlighting

**Usage:**
```tsx
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Home, Package } from 'lucide-react';

<Breadcrumbs 
  items={[
    { label: 'Home', icon: Home, onClick: () => navigate('home') },
    { label: 'Products', icon: Package }
  ]}
/>
```

**With Hook:**
```tsx
import { useBreadcrumbs } from '@/app/components/Breadcrumbs';

const breadcrumbs = useBreadcrumbs('products', [
  { label: 'Product Details', onClick: () => navigate('details') }
]);

<Breadcrumbs items={breadcrumbs} />
```

**Location:** Added to Dashboard and ProductsPage

---

### 4. **Column Customizer** (`ColumnCustomizer.tsx`)

**Features:**
- Show/hide table columns
- Visual column list
- Pinned column support
- Reset to defaults
- Persistence ready

**Usage:**
```tsx
import { ColumnCustomizer, TableColumn } from '@/app/components/ColumnCustomizer';

const [columns, setColumns] = useState<TableColumn[]>([
  { id: 'name', label: 'Product Name', visible: true, pinned: true },
  { id: 'sku', label: 'SKU', visible: true },
  { id: 'price', label: 'Price', visible: false },
]);

<ColumnCustomizer 
  columns={columns}
  onColumnsChange={setColumns}
/>
```

**Render Columns:**
```tsx
<TableHeader>
  <TableRow>
    {columns
      .filter(col => col.visible)
      .map(col => <TableHead key={col.id}>{col.label}</TableHead>)}
  </TableRow>
</TableHeader>
```

**Location:** Integrated in ProductsPage table view

---

### 5. **Loading Skeleton** (`LoadingSkeleton.tsx`)

**Features:**
- Multiple variants (card, table, list, stat, chart, text)
- Shimmer animation effect
- Dark mode support
- Customizable count
- Staggered animations

**Variants:**

**Card Skeleton:**
```tsx
<LoadingSkeleton variant="card" count={4} />
```

**Table Skeleton:**
```tsx
<LoadingSkeleton variant="table" />
```

**List Skeleton:**
```tsx
<LoadingSkeleton variant="list" count={5} />
```

**Stat Card Skeleton:**
```tsx
<LoadingSkeleton variant="stat" count={4} />
```

**Chart Skeleton:**
```tsx
<LoadingSkeleton variant="chart" />
```

**Text Skeleton:**
```tsx
<LoadingSkeleton variant="text" count={3} />
```

**Usage Example:**
```tsx
{isLoading ? (
  <LoadingSkeleton variant="table" />
) : (
  <ProductTable products={products} />
)}
```

---

## 🎨 Styling Notes

### Shimmer Animation
The shimmer effect is defined in `src/styles/index.css`:
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

### Dark Mode
All components support dark mode with proper contrast:
- `dark:bg-slate-800` for cards
- `dark:text-white` for text
- `dark:border-slate-700` for borders

---

## 📍 Integration Status

### ✅ DashboardLayout
- Command Palette (global)
- Keyboard Shortcuts Help (global)
- Command Palette Hint in header

### ✅ Dashboard Page
- Breadcrumbs navigation

### ✅ ProductsPage
- Breadcrumbs navigation
- Column Customizer (table view only)
- Loading state support ready

---

## 🎯 Best Practices

### 1. **Command Palette**
- Add custom actions to `actionItems` array
- Keep navigation items up to date
- Use badges to highlight new features

### 2. **Loading Skeletons**
- Match skeleton variant to content type
- Use `count` prop for consistent loading states
- Maintain same layout structure as loaded content

### 3. **Breadcrumbs**
- Keep hierarchy shallow (3-4 levels max)
- Use icons sparingly (first and last items)
- Make intermediate items clickable for navigation

### 4. **Column Customizer**
- Pin important columns (ID, Name, Actions)
- Save column preferences to localStorage
- Provide sensible defaults

### 5. **Keyboard Shortcuts**
- Use platform conventions (⌘ for Mac, Ctrl for Windows)
- Group related shortcuts together
- Update help modal when adding new shortcuts

---

## 🔧 Customization Examples

### Custom Command Palette Actions
```tsx
const customActions = [
  { 
    icon: Download, 
    label: 'Generate Report', 
    action: () => generateReport(),
    badge: 'New'
  },
  { 
    icon: Upload, 
    label: 'Bulk Import', 
    action: () => openImportModal() 
  },
];
```

### Persist Column Preferences
```tsx
const [columns, setColumns] = useState<TableColumn[]>(() => {
  const saved = localStorage.getItem('productColumns');
  return saved ? JSON.parse(saved) : defaultColumns;
});

const handleColumnsChange = (newColumns: TableColumn[]) => {
  setColumns(newColumns);
  localStorage.setItem('productColumns', JSON.stringify(newColumns));
};
```

### Loading State Pattern
```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchData().then(() => setIsLoading(false));
}, []);

return (
  <div>
    {isLoading ? (
      <LoadingSkeleton variant="card" count={4} />
    ) : (
      <DataCards data={data} />
    )}
  </div>
);
```

---

## 🚀 Next Steps

### Recommended Enhancements:
1. Add toast notifications using Sonner
2. Implement actual loading states in data fetching
3. Add localStorage persistence for column preferences
4. Create onboarding tour for new users
5. Add bulk actions toolbar for multi-select
6. Implement advanced filters drawer
7. Add data export functionality

---

## 📚 Component Files

```
src/app/components/
├── CommandPalette.tsx          ✓ Command palette with ⌘K
├── KeyboardShortcutsHelp.tsx   ✓ Shortcuts help modal
├── Breadcrumbs.tsx             ✓ Navigation breadcrumbs
├── ColumnCustomizer.tsx        ✓ Table column customization
├── LoadingSkeleton.tsx         ✓ Loading state skeletons
├── DashboardLayout.tsx         ✓ Updated with new components
├── Dashboard.tsx               ✓ Updated with breadcrumbs
└── ProductsPage.tsx            ✓ Updated with all features
```

---

## 💡 Tips

- **Discoverability**: The command palette hint appears in the header
- **Keyboard First**: Press `?` to see all available shortcuts
- **Professional Look**: Loading skeletons provide polished UX
- **Customizable**: Column customizer empowers users
- **Context Aware**: Breadcrumbs show current location

Enjoy your professional, enterprise-grade UI! 🎉
