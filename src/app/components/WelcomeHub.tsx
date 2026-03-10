import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowRight, 
  PlusCircle, 
  FileText, 
  Truck,
  TrendingUp,
  Settings,
  HelpCircle,
  Building2,
  Box,
  Receipt,
  BarChart3,
  ListTodo
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export function WelcomeHub({ onNavigate }) {
  const { user } = useAuth();

  // Mock setup progress
  const setupProgress = 65;
  const setupTasks = [
    { name: 'Organization Profile', completed: true },
    { name: 'Add First Product', completed: true },
    { name: 'Set up Tax Rates', completed: false },
    { name: 'Connect Bank Account', completed: false },
  ];

  const quickActions = [
    { title: 'New Product', icon: Package, action: () => onNavigate?.('products'), color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10' },
    { title: 'New Order', icon: ShoppingCart, action: () => onNavigate?.('orders'), color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    { title: 'New Invoice', icon: Receipt, action: () => onNavigate?.('invoices'), color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10' },
    { title: 'New Customer', icon: Users, action: () => onNavigate?.('customers'), color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  ];

  const moduleCards = [
    {
      title: 'Inventory Control',
      description: 'Manage items, items groups, inventory adjustments and track stock levels.',
      icon: Box,
      color: 'bg-teal-500',
      links: [
        { label: 'View Products', path: 'products' },
        { label: 'Stock Adjustments', path: 'stock-adjustments' },
        { label: 'Low Stock Alerts', path: 'low-stock-alerts' },
      ]
    },
    {
      title: 'Sales & Orders',
      description: 'Process sales orders, packages, shipments, and manage customer accounts.',
      icon: ShoppingCart,
      color: 'bg-emerald-500',
      links: [
        { label: 'Sales Orders', path: 'orders' },
        { label: 'Customers', path: 'customers' },
        { label: 'Returns & Refunds', path: 'returns' },
      ]
    },
    {
      title: 'Purchases',
      description: 'Manage vendors, create purchase orders, and track incoming shipments.',
      icon: Truck,
      color: 'bg-amber-500',
      links: [
        { label: 'Purchase Orders', path: 'purchase-orders' },
        { label: 'Suppliers', path: 'suppliers' },
        { label: 'Bills', path: 'transactions' },
      ]
    },
    {
      title: 'Reports & Performance',
      description: 'Detailed analytics and insights on your business performance.',
      icon: BarChart3,
      color: 'bg-teal-500',
      links: [
        { label: 'Performance Dashboard', path: 'dashboard' },
        { label: 'Detailed Analytics', path: 'analytics' },
        { label: 'AI Insights', path: 'ai-dashboard' },
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-teal-400 opacity-20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="text-teal-100 max-w-2xl text-lg mb-8">
            Here's what's happening with your inventory today. Use the hub below to quickly navigate to the areas you need.
          </p>

          <div className="flex flex-wrap gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={i} 
                  variant="secondary" 
                  className="bg-white/10 hover:bg-white/20 text-white border-none shadow-sm backdrop-blur-sm gap-2 transition-all hover:scale-105"
                  onClick={action.action}
                >
                  <Icon className="w-4 h-4" />
                  {action.title}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Modules) - Takes up 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-500" />
              Business Hub
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {moduleCards.map((mod, index) => {
              const Icon = mod.icon;
              return (
                <Card key={index} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className={cn("h-2 w-full", mod.color)} />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={cn("p-2 rounded-lg text-white", mod.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {mod.title}
                    </CardTitle>
                    <CardDescription className="text-sm pt-2">
                      {mod.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 mt-2">
                      {mod.links.map((link, i) => (
                        <li key={i}>
                          <button
                            onClick={() => onNavigate?.(link.path)}
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 group w-full text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-teal-500 mr-2 transition-colors" />
                            {link.label}
                            <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:translate-x-3 transition-all ml-auto" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar (Setup & Info) - Takes up 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Setup Progress Widget */}
          <Card className="border-teal-100 dark:border-teal-900 shadow-md">
            <CardHeader className="pb-3 bg-teal-50/50 dark:bg-teal-900/10">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-teal-500" />
                  Setup Progress
                </span>
                <span className="text-sm text-teal-600">{setupProgress}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Progress value={setupProgress} className="h-2 mb-6" />
              
              <div className="space-y-3">
                {setupTasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 flex-shrink-0",
                      task.completed 
                        ? "border-green-500 bg-green-500" 
                        : "border-slate-300 dark:border-slate-600"
                    )}>
                      {task.completed && <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={cn(
                      "text-sm",
                      task.completed ? "text-slate-500 line-through" : "text-slate-900 dark:text-slate-300 font-medium"
                    )}>
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4">
              <Button variant="outline" className="w-full text-teal-600 border-teal-200 hover:bg-teal-50">
                Continue Setup
              </Button>
            </CardFooter>
          </Card>

          {/* Help & Support Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                Need help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Check out our resources to get the most out of your inventory management system.
              </p>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm h-9 px-2 hover:bg-slate-100">
                  <FileText className="w-4 h-4 mr-2 text-teal-500" />
                  Read the User Guide
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9 px-2 hover:bg-slate-100">
                  <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                  Watch Video Tutorials
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm h-9 px-2 hover:bg-slate-100"
                  onClick={() => onNavigate?.('support-tickets')}
                >
                  <HelpCircle className="w-4 h-4 mr-2 text-emerald-500" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
