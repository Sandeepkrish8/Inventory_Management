import React, { useState, useEffect, useCallback } from 'react';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/app/components/ui/command';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  ArrowLeftRight,
  ShoppingCart,
  Settings,
  BarChart3,
  Search,
  FileText,
  User,
  Bell,
  LogOut,
  Plus,
  Download,
  Upload,
  Filter,
  Users,
  AlertTriangle,
  DollarSign,
  AlertCircle,
  RotateCcw,
  UserCog,
  Warehouse,
  TruckIcon
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/contexts/AuthContext';

interface CommandPaletteProps {
  onNavigate?: (page: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Toggle command palette with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback((callback: () => void) => {
    setOpen(false);
    callback();
  }, []);

  const allNavigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', action: () => onNavigate?.('dashboard'), shortcut: '⌘D', allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { icon: BarChart3, label: 'Analytics', action: () => onNavigate?.('analytics'), shortcut: '⌘A', allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { icon: Package, label: 'Products', action: () => onNavigate?.('products'), shortcut: '⌘P', allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { icon: FolderTree, label: 'Categories', action: () => onNavigate?.('categories'), shortcut: '⌘C', allowedRoles: ['Admin', 'Staff'] },
    { icon: Truck, label: 'Suppliers', action: () => onNavigate?.('suppliers'), shortcut: '⌘S', allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { icon: ArrowLeftRight, label: 'Transactions', action: () => onNavigate?.('transactions'), shortcut: '⌘T', allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { icon: ShoppingCart, label: 'Orders', action: () => onNavigate?.('orders'), shortcut: '⌘O', allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { icon: FileText, label: 'Purchase Orders', action: () => onNavigate?.('purchase-orders'), allowedRoles: ['Admin', 'Staff'] },
    { icon: Users, label: 'Customers', action: () => onNavigate?.('customers'), allowedRoles: ['Admin', 'Staff'] },
    { icon: AlertTriangle, label: 'Stock Adjustments', action: () => onNavigate?.('stock-adjustments'), allowedRoles: ['Admin', 'Staff'] },
    { icon: DollarSign, label: 'Invoices', action: () => onNavigate?.('invoices'), allowedRoles: ['Admin'] },
    { icon: AlertCircle, label: 'Low Stock Alerts', action: () => onNavigate?.('low-stock-alerts'), allowedRoles: ['Admin'] },
    { icon: UserCog, label: 'Users Management', action: () => onNavigate?.('users'), allowedRoles: ['Admin'] },
    { icon: Warehouse, label: 'Warehouses', action: () => onNavigate?.('warehouses'), allowedRoles: ['Admin'] },
    { icon: TruckIcon, label: 'Stock Transfers', action: () => onNavigate?.('stock-transfers'), allowedRoles: ['Admin', 'Staff'] },
    { icon: Settings, label: 'Settings', action: () => onNavigate?.('settings'), shortcut: '⌘,', allowedRoles: ['Admin', 'Staff', 'Viewer'] },
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => {
    if (!user?.role) return false;
    return (item as any).allowedRoles.includes(user.role);
  });

  const actionItems = [
    { icon: Plus, label: 'Add New Product', action: () => console.log('Add product'), badge: 'New' },
    { icon: Plus, label: 'Create Order', action: () => console.log('Create order') },
    { icon: Upload, label: 'Import Data', action: () => console.log('Import') },
    { icon: Download, label: 'Export Report', action: () => console.log('Export') },
    { icon: Filter, label: 'Advanced Filters', action: () => console.log('Filters') },
  ];

  const quickActions = [
    { icon: Search, label: 'Search Products', action: () => console.log('Search products') },
    { icon: FileText, label: 'View Reports', action: () => console.log('Reports') },
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications') },
    { icon: User, label: 'Profile Settings', action: () => console.log('Profile') },
  ];

  return (
    <>
      {/* Trigger Button - Optional, can be called from anywhere */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Navigation */}
          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.label}
                  onSelect={() => handleSelect(item.action)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-xs font-medium text-slate-600 dark:text-slate-400">
                      {item.shortcut}
                    </kbd>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          {/* Actions */}
          <CommandGroup heading="Actions">
            {actionItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.label}
                  onSelect={() => handleSelect(item.action)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          {/* Quick Actions */}
          <CommandGroup heading="Quick Actions">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.label}
                  onSelect={() => handleSelect(item.action)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>{item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

// Hint component to show in the UI
export const CommandPaletteHint: React.FC = () => {
  return (
    <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <span>Press</span>
      <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-400">
        ⌘K
      </kbd>
      <span>for quick access</span>
    </div>
  );
};
