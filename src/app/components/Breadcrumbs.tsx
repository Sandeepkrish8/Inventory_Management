import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 flex-shrink-0" />
            )}
            
            {isLast ? (
              <span className="flex items-center gap-1.5 text-slate-900 dark:text-white font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// Helper hook to generate breadcrumbs based on current page
export const useBreadcrumbs = (currentPage: string, additionalItems?: BreadcrumbItem[]) => {
  const pageMap: Record<string, BreadcrumbItem> = {
    dashboard: { label: 'Dashboard', icon: Home },
    analytics: { label: 'Analytics' },
    products: { label: 'Products' },
    categories: { label: 'Categories' },
    suppliers: { label: 'Suppliers' },
    transactions: { label: 'Transactions' },
    orders: { label: 'Orders' },
    settings: { label: 'Settings' },
  };

  const baseBreadcrumb: BreadcrumbItem = { 
    label: 'Home', 
    icon: Home,
  };

  const currentBreadcrumb = pageMap[currentPage];
  
  let breadcrumbs = [baseBreadcrumb];
  
  if (currentBreadcrumb && currentPage !== 'dashboard') {
    breadcrumbs.push(currentBreadcrumb);
  }

  if (additionalItems) {
    breadcrumbs = [...breadcrumbs, ...additionalItems];
  }

  return breadcrumbs;
};
