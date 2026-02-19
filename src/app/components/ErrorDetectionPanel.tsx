import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { useAI } from '@/app/contexts/AIContext';
import { detectErrors } from '@/app/services/aiService';
import { mockProducts } from '@/app/data/mockData';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Package,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export const ErrorDetectionPanel: React.FC = () => {
  const { detectedErrors, setDetectedErrors } = useAI();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const loadErrors = async () => {
    setLoading(true);
    try {
      const errors = await detectErrors(mockProducts);
      setDetectedErrors(errors);
      if (errors.length > 0) {
        toast.warning(`Found ${errors.length} potential issues`);
      } else {
        toast.success('No errors detected');
      }
    } catch (error) {
      toast.error('Failed to scan for errors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadErrors();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock_mismatch':
        return <Package className="w-4 h-4" />;
      case 'pricing_anomaly':
        return <DollarSign className="w-4 h-4" />;
      case 'demand_spike':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredErrors = filter === 'all' 
    ? detectedErrors 
    : detectedErrors.filter(e => e.severity === filter);

  const errorCounts = {
    all: detectedErrors.length,
    critical: detectedErrors.filter(e => e.severity === 'critical').length,
    high: detectedErrors.filter(e => e.severity === 'high').length,
    medium: detectedErrors.filter(e => e.severity === 'medium').length,
    low: detectedErrors.filter(e => e.severity === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Error Detection
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI-powered anomaly detection and error identification
          </p>
        </div>
        <Button
          onClick={loadErrors}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Scan Now
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card 
          className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{errorCounts.all}</p>
            <p className="text-xs text-slate-500 mt-1">Total Issues</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${filter === 'critical' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('critical')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{errorCounts.critical}</p>
            <p className="text-xs text-slate-500 mt-1">Critical</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${filter === 'high' ? 'ring-2 ring-orange-500' : ''}`}
          onClick={() => setFilter('high')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{errorCounts.high}</p>
            <p className="text-xs text-slate-500 mt-1">High</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${filter === 'medium' ? 'ring-2 ring-amber-500' : ''}`}
          onClick={() => setFilter('medium')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{errorCounts.medium}</p>
            <p className="text-xs text-slate-500 mt-1">Medium</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${filter === 'low' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('low')}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{errorCounts.low}</p>
            <p className="text-xs text-slate-500 mt-1">Low</p>
          </CardContent>
        </Card>
      </div>

      {/* Error List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Detected Issues {filter !== 'all' && `(${filter.toUpperCase()})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredErrors.length > 0 ? (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {filteredErrors.map((error) => (
                  <Alert
                    key={error.id}
                    className={`${getSeverityColor(error.severity)} border`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getSeverityIcon(error.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize gap-1">
                            {getTypeIcon(error.type)}
                            {error.type.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            variant={error.severity === 'critical' ? 'destructive' : 'secondary'}
                            className="capitalize"
                          >
                            {error.severity}
                          </Badge>
                        </div>
                        <AlertDescription>
                          <p className="font-medium text-sm mb-1">{error.productName}</p>
                          <p className="text-sm mb-2">{error.message}</p>
                          <div className="flex items-start gap-2 mt-3 p-3 rounded-md bg-white/50 dark:bg-black/20">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Suggested Action:
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {error.suggestedAction}
                              </p>
                            </div>
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">All Clear!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No {filter !== 'all' ? filter : ''} issues detected in your inventory
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
