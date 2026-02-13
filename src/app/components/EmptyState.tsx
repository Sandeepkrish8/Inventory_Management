import React from 'react';
import { Package, ShoppingCart, FileText, AlertCircle, Search, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface EmptyStateProps {
  type: 'products' | 'orders' | 'transactions' | 'search' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction
}) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'products':
        return {
          icon: Package,
          defaultTitle: 'No products found',
          defaultDescription: 'Get started by adding your first product to inventory',
          defaultActionLabel: 'Add Product',
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'orders':
        return {
          icon: ShoppingCart,
          defaultTitle: 'No orders yet',
          defaultDescription: 'Orders will appear here once customers place them',
          defaultActionLabel: 'Create Order',
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'transactions':
        return {
          icon: FileText,
          defaultTitle: 'No transactions',
          defaultDescription: 'Transaction history will be displayed here',
          defaultActionLabel: null,
          iconColor: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
      case 'search':
        return {
          icon: Search,
          defaultTitle: 'No results found',
          defaultDescription: 'Try adjusting your search or filter to find what you\'re looking for',
          defaultActionLabel: 'Clear Filters',
          iconColor: 'text-slate-600',
          bgColor: 'bg-slate-50'
        };
      default:
        return {
          icon: AlertCircle,
          defaultTitle: 'No data available',
          defaultDescription: 'There is no data to display at the moment',
          defaultActionLabel: null,
          iconColor: 'text-slate-600',
          bgColor: 'bg-slate-50'
        };
    }
  };

  const config = getEmptyStateConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-md mb-6">
        {description || config.defaultDescription}
      </p>
      {(actionLabel || config.defaultActionLabel) && onAction && (
        <Button onClick={onAction} className="gap-2">
          <Plus className="w-4 h-4" />
          {actionLabel || config.defaultActionLabel}
        </Button>
      )}
    </div>
  );
};

// Loading skeleton component
export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-slate-100 rounded-lg">
          <div className="w-12 h-12 bg-slate-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="w-20 h-8 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
};
