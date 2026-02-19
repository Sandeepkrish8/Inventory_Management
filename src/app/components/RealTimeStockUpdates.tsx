import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useAI } from '@/app/contexts/AIContext';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  X,
  Package,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const RealTimeStockUpdates: React.FC = () => {
  const { recentStockUpdates, clearStockUpdates } = useAI();
  const [isLive, setIsLive] = useState(true);

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'restock':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'return':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-amber-500" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-red-600 dark:text-red-400';
      case 'restock':
        return 'text-green-600 dark:text-green-400';
      case 'return':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-amber-600 dark:text-amber-400';
    }
  };

  useEffect(() => {
    if (recentStockUpdates.length > 0 && isLive) {
      const latestUpdate = recentStockUpdates[0];
      toast.info(
        `Stock Update: ${latestUpdate.productName}`,
        {
          description: `${latestUpdate.changeType.toUpperCase()}: ${latestUpdate.oldQuantity} → ${latestUpdate.newQuantity}`,
          duration: 3000,
        }
      );
    }
  }, [recentStockUpdates, isLive]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            Real-Time Stock Updates
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isLive ? 'default' : 'secondary'} className="gap-1">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              {isLive ? 'LIVE' : 'PAUSED'}
            </Badge>
            {recentStockUpdates.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearStockUpdates}
                className="h-7 w-7 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recentStockUpdates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No recent updates
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Stock changes will appear here in real-time
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {recentStockUpdates.map((update, index) => (
                <div
                  key={`${update.productId}-${update.timestamp}-${index}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                >
                  <div className="mt-0.5">
                    {getChangeIcon(update.changeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {update.productName}
                      </p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {update.changeType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span>{update.oldQuantity}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className={getChangeColor(update.changeType)}>
                        {update.newQuantity}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        {format(new Date(update.timestamp), 'HH:mm:ss')}
                      </span>
                    </div>
                    {update.location && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        📍 {update.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
