import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useAI } from '@/app/contexts/AIContext';
import {
  Bell,
  BellOff,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const AIAlertsPanel: React.FC = () => {
  const { recentAlerts, clearAlerts } = useAI();
  const [mutedTypes, setMutedTypes] = React.useState<Set<string>>(new Set());

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'Low Stock';
      case 'out_of_stock':
        return 'Out of Stock';
      case 'restock_needed':
        return 'Restock Needed';
      case 'expiry_warning':
        return 'Expiry Warning';
      default:
        return type;
    }
  };

  const toggleMuteType = (type: string) => {
    setMutedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
        toast.success(`Unmuted ${getTypeLabel(type)} alerts`);
      } else {
        newSet.add(type);
        toast.info(`Muted ${getTypeLabel(type)} alerts`);
      }
      return newSet;
    });
  };

  const dismissAlert = (alertId: string) => {
    toast.success('Alert dismissed');
  };

  const visibleAlerts = recentAlerts.filter(alert => !mutedTypes.has(alert.type));

  const alertTypeCounts = recentAlerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            AI Alerts
            {visibleAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {visibleAlerts.length}
              </Badge>
            )}
          </CardTitle>
          {recentAlerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAlerts}
              className="h-7 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Alert Type Filters */}
        {Object.keys(alertTypeCounts).length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(alertTypeCounts).map(([type, count]) => {
              const isMuted = mutedTypes.has(type);
              return (
                <Badge
                  key={type}
                  variant={isMuted ? 'secondary' : 'default'}
                  className="cursor-pointer gap-1.5"
                  onClick={() => toggleMuteType(type)}
                >
                  {isMuted ? <BellOff className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                  {getTypeLabel(type)} ({count})
                </Badge>
              );
            })}
          </div>
        )}

        {/* Alerts List */}
        {visibleAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            {recentAlerts.length === 0 ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  No Active Alerts
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All systems are running smoothly
                </p>
              </>
            ) : (
              <>
                <BellOff className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  All alert types are muted
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Click on the badges above to unmute
                </p>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge 
                          variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                          className="capitalize text-xs"
                        >
                          {getTypeLabel(alert.type)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-medium text-sm mb-1">{alert.productName}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        {alert.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {format(new Date(alert.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
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
