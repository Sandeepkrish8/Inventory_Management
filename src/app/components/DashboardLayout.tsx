import React, { ReactNode, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTenant } from '@/app/contexts/TenantContext';
import { Button } from '@/app/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Truck, 
  ArrowLeftRight, 
  ShoppingCart, 
  LogOut,
  User,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  ChevronDown,
  BarChart3,
  Building2,
  Globe,
  CheckCircle2,
  FileText,
  Users,
  AlertTriangle,
  DollarSign,
  AlertCircle,
  RotateCcw,
  UserCog,
  Warehouse,
  TruckIcon,
  Brain,
  Sparkles
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { NotificationsPanel } from '@/app/components/NotificationsPanel';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import { GlobalSearch } from '@/app/components/GlobalSearch';
import { CommandPalette, CommandPaletteHint } from '@/app/components/CommandPalette';
import { KeyboardShortcutsHelp } from '@/app/components/KeyboardShortcutsHelp';
import { Separator } from '@/app/components/ui/separator';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentPage, 
  onNavigate 
}) => {
  const { user, logout } = useAuth();
  const { currentTenant, currentEnvironment, availableTenants, switchTenant, switchEnvironment } = useTenant();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { id: 'ai-dashboard', label: 'AI Dashboard', icon: Brain, allowedRoles: ['Admin', 'Staff', 'Viewer'], badge: 'AI' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { id: 'products', label: 'Products', icon: Package, allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { id: 'categories', label: 'Categories', icon: FolderTree, allowedRoles: ['Admin', 'Staff'] },
    { id: 'suppliers', label: 'Suppliers', icon: Truck, allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, allowedRoles: ['Admin', 'Staff', 'Viewer'] },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: FileText, allowedRoles: ['Admin', 'Staff'] },
    { id: 'customers', label: 'Customers', icon: Users, allowedRoles: ['Admin', 'Staff'] },
    { id: 'stock-adjustments', label: 'Stock Adjustments', icon: AlertTriangle, allowedRoles: ['Admin', 'Staff'] },
    { id: 'invoices', label: 'Invoices', icon: DollarSign, allowedRoles: ['Admin'] },
    { id: 'low-stock-alerts', label: 'Low Stock Alerts', icon: AlertCircle, allowedRoles: ['Admin'] },
    { id: 'users', label: 'Users Management', icon: UserCog, allowedRoles: ['Admin'] },
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse, allowedRoles: ['Admin'] },
    { id: 'stock-transfers', label: 'Stock Transfers', icon: TruckIcon, allowedRoles: ['Admin', 'Staff'] },
    { id: 'settings', label: 'Settings', icon: Settings, allowedRoles: ['Admin', 'Staff', 'Viewer'] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (!user?.role) return false;
    return (item as any).allowedRoles.includes(user.role);
  });

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Command Palette */}
      <CommandPalette onNavigate={onNavigate} />
      
      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />
      
      {/* Top Navigation - Glass Effect */}
      <header className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-700/70 sticky top-0 z-50 shadow-xl dark:shadow-2xl dark:shadow-blue-900/20">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 dark:shadow-blue-900/50 ring-2 ring-blue-400/20">
                <Package className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Inventory Management</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">System Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center - Search Bar (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 items-center gap-4">
            <GlobalSearch />
            <CommandPaletteHint />
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Tenant/Environment Switcher */}
            {currentTenant && currentEnvironment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hidden lg:flex hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={currentTenant.logo} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {currentTenant.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white max-w-[120px] truncate">
                        {currentTenant.name}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] h-4 px-1",
                          currentEnvironment.type === 'production' && "border-red-500/50 text-red-700 dark:text-red-400",
                          currentEnvironment.type === 'staging' && "border-amber-500/50 text-amber-700 dark:text-amber-400",
                          currentEnvironment.type === 'development' && "border-blue-500/50 text-blue-700 dark:text-blue-400"
                        )}
                      >
                        {currentEnvironment.type}
                      </Badge>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Switch Workspace
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Tenants Section */}
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Organizations
                    </p>
                    <div className="space-y-1">
                      {availableTenants.map((tenant) => (
                        <DropdownMenuItem
                          key={tenant.id}
                          onClick={() => switchTenant(tenant.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={tenant.logo} />
                              <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                {tenant.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{tenant.name}</p>
                              <Badge variant="outline" className="text-[10px] h-4 capitalize">
                                {tenant.subscription}
                              </Badge>
                            </div>
                            {currentTenant.id === tenant.id && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Environments Section */}
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      Environments
                    </p>
                    <div className="space-y-1">
                      {currentTenant.environments.map((env) => (
                        <DropdownMenuItem
                          key={env.id}
                          onClick={() => switchEnvironment(env.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                env.status === 'active' && "bg-green-500",
                                env.status === 'inactive' && "bg-slate-400",
                                env.status === 'maintenance' && "bg-amber-500"
                              )} />
                              <span className="text-sm">{env.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge 
                                variant={env.type === 'production' ? 'destructive' : 'secondary'}
                                className="text-[10px] h-4 capitalize"
                              >
                                {env.type}
                              </Badge>
                              {currentEnvironment.id === env.id && (
                                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                              )}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notifications */}
            <NotificationsPanel />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hidden sm:flex hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center ring-2 ring-purple-400/20 shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile User Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Glass Effect */}
        <aside
          className={cn(
            "fixed lg:sticky top-[57px] sm:top-[73px] left-0 z-40 w-64 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-700/70 h-[calc(100vh-57px)] sm:h-[calc(100vh-73px)] transition-transform duration-300 ease-in-out shadow-2xl dark:shadow-2xl dark:shadow-blue-900/20",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto h-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all text-left group relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 dark:shadow-blue-900/50" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
                  )}
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300 relative z-10",
                    isActive ? "text-white scale-110" : "text-slate-600 dark:text-slate-400 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  )} />
                  <span className="font-semibold text-sm sm:text-base relative z-10">{item.label}</span>
                  {(item as any).badge && (
                    <Badge 
                      variant={isActive ? "secondary" : "default"} 
                      className={cn(
                        "ml-auto text-[10px] h-5 px-1.5 relative z-10",
                        isActive && "bg-white/20 text-white border-white/30"
                      )}
                    >
                      <Sparkles className="w-3 h-3 mr-0.5" />
                      {(item as any).badge}
                    </Badge>
                  )}
                  {isActive && !(item as any).badge && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse relative z-10" />
                  )}
                </button>
              );
            })}

            {/* User Info at Bottom (Mobile) */}
            <div className="lg:hidden mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-purple-400/20">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-57px)] sm:min-h-[calc(100vh-73px)] overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};