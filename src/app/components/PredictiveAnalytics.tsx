import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useAI } from '@/app/contexts/AIContext';
import { predictDemand, getDynamicPricing } from '@/app/services/aiService';
import { mockProducts } from '@/app/data/mockData';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  DollarSign,
  Package,
  Calendar,
  AlertTriangle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { toast } from 'sonner';

export const PredictiveAnalytics: React.FC = () => {
  const { predictions, setPredictions, pricingSuggestions, setPricingSuggestions } = useAI();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('demand');

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const results = await predictDemand(mockProducts.slice(0, 15));
      setPredictions(results);
      toast.success('Predictions updated successfully');
    } catch (error) {
      toast.error('Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  const loadPricing = async () => {
    setLoading(true);
    try {
      const results = await getDynamicPricing(mockProducts);
      setPricingSuggestions(results);
      toast.success('Pricing suggestions updated');
    } catch (error) {
      toast.error('Failed to load pricing suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
    loadPricing();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600 dark:text-green-400';
      case 'decreasing':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  // Prepare chart data
  const demandChartData = predictions.slice(0, 8).map(p => ({
    name: p.productName.length > 15 ? p.productName.substring(0, 15) + '...' : p.productName,
    current: p.currentStock,
    predicted: p.predictedDemand,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Predictive Analytics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI-powered insights for demand forecasting and pricing optimization
          </p>
        </div>
        <Button
          onClick={() => {
            loadPredictions();
            loadPricing();
          }}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demand" className="gap-2">
            <Package className="w-4 h-4" />
            Demand Forecast
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Dynamic Pricing
          </TabsTrigger>
        </TabsList>

        {/* Demand Forecast Tab */}
        <TabsContent value="demand" className="space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demand vs Current Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demandChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#3b82f6" name="Current Stock" />
                  <Bar dataKey="predicted" fill="#8b5cf6" name="Predicted Demand" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predictions List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {predictions.map((prediction) => (
                    <div
                      key={prediction.productId}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm">{prediction.productName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getTrendIcon(prediction.trend)}
                            <span className={`text-xs font-medium capitalize ${getTrendColor(prediction.trend)}`}>
                              {prediction.trend}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(prediction.confidence * 100)}% confidence
                            </Badge>
                          </div>
                        </div>
                        {prediction.daysUntilStockout && prediction.daysUntilStockout < 30 && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {prediction.daysUntilStockout}d left
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Current Stock</p>
                          <p className="text-base font-semibold">{prediction.currentStock}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Predicted Demand</p>
                          <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                            {prediction.predictedDemand}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Reorder Qty</p>
                          <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                            {prediction.recommendedOrderQuantity}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Confidence Level</span>
                          <span className="font-medium">{Math.round(prediction.confidence * 100)}%</span>
                        </div>
                        <Progress value={prediction.confidence * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dynamic Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI-Powered Pricing Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {pricingSuggestions.map((suggestion) => {
                    const priceDiff = suggestion.suggestedPrice - suggestion.currentPrice;
                    const percentChange = ((priceDiff / suggestion.currentPrice) * 100).toFixed(1);
                    const isIncrease = priceDiff > 0;

                    return (
                      <div
                        key={suggestion.productId}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Current:</span>
                                <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                                  ${suggestion.currentPrice.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {isIncrease ? (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm font-medium ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                                  {isIncrease ? '+' : ''}{percentChange}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">Suggested:</span>
                              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                ${suggestion.suggestedPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                          {suggestion.reason}
                        </p>

                        {(suggestion.expectedImpact.salesIncrease || suggestion.expectedImpact.profitIncrease) && (
                          <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            {suggestion.expectedImpact.salesIncrease && (
                              <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-slate-600 dark:text-slate-300">
                                  +{suggestion.expectedImpact.salesIncrease.toFixed(1)}% sales
                                </span>
                              </div>
                            )}
                            {suggestion.expectedImpact.profitIncrease && (
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-blue-500" />
                                <span className="text-slate-600 dark:text-slate-300">
                                  +{suggestion.expectedImpact.profitIncrease.toFixed(1)}% profit
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
