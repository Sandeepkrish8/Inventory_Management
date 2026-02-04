import React from 'react';
import { Product } from '@/app/types';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { 
  Edit, 
  Trash2, 
  Eye, 
  AlertCircle,
  Package,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface EnhancedProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const isLowStock = product.quantity <= product.minStockLevel;
  const profit = product.sellingPrice - product.unitPrice;
  const profitMargin = ((profit / product.unitPrice) * 100).toFixed(1);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 overflow-hidden">
      {/* Color accent bar based on stock level */}
      <div className={cn(
        "h-2 w-full",
        isLowStock ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-blue-500 to-green-500"
      )} />
      
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-base sm:text-lg truncate mb-1">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">SKU: {product.sku}</p>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
            isLowStock ? "bg-orange-100" : "bg-blue-100"
          )}>
            <Package className={cn(
              "w-6 h-6",
              isLowStock ? "text-orange-600" : "text-blue-600"
            )} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Category</p>
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Stock</p>
            <div className="flex items-center gap-1">
              {isLowStock && <AlertCircle className="w-3 h-3 text-orange-600" />}
              <Badge variant={isLowStock ? 'destructive' : 'default'} className="text-xs">
                {product.quantity} units
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Unit Price</p>
            <p className="text-sm font-semibold text-slate-900">${product.unitPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Selling Price</p>
            <p className="text-sm font-semibold text-green-600">${product.sellingPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Profit Indicator */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {profit > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className="text-xs text-slate-600">Profit Margin</span>
            </div>
            <span className={cn(
              "text-sm font-semibold",
              profit > 0 ? "text-green-600" : "text-red-600"
            )}>
              {profitMargin}%
            </span>
          </div>
        </div>

        {/* Supplier */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-1">Supplier</p>
          <p className="text-sm text-slate-700">{product.supplier}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(product)}
            className="flex-1 gap-1"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">View</span>
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="flex-1 gap-1"
            >
              <Edit className="w-3 h-3" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
