import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { getRecommendations } from '@/app/services/aiService';
import { mockProducts } from '@/app/data/mockData';
import { Product } from '@/app/types';
import {
  Sparkles,
  TrendingUp,
  Package,
  Star,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductRecommendationsProps {
  productId: string;
  onProductSelect?: (product: Product) => void;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  productId,
  onProductSelect,
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const results = await getRecommendations(productId, mockProducts);
      setRecommendations(results);
    } catch (error) {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadRecommendations();
    }
  }, [productId]);

  const handleProductClick = (recommendedProduct: any) => {
    const product = mockProducts.find(p => p.id === recommendedProduct.productId);
    if (product) {
      onProductSelect?.(product);
      toast.success(`Viewing ${product.name}`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Recommended Products
          <Badge variant="secondary" className="ml-2 text-xs">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {recommendations.map((recommendation) => {
              const product = mockProducts.find(p => p.id === recommendation.productId);
              if (!product) return null;

              return (
                <div
                  key={recommendation.productId}
                  onClick={() => handleProductClick(recommendation)}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {recommendation.imageUrl ? (
                        <img 
                          src={recommendation.imageUrl} 
                          alt={recommendation.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {recommendation.productName}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-medium">
                            {Math.round(recommendation.relevanceScore * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        {recommendation.reason}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ${product.price.toFixed(2)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {product.quantity} in stock
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
