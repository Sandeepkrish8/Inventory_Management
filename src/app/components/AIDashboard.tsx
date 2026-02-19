import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Sparkles,
  BarChart3,
  DollarSign,
  Package,
  Zap
} from 'lucide-react';
import { RealTimeStockUpdates } from '@/app/components/RealTimeStockUpdates';
import { PredictiveAnalytics } from '@/app/components/PredictiveAnalytics';
import { ErrorDetectionPanel } from '@/app/components/ErrorDetectionPanel';
import { AIAlertsPanel } from '@/app/components/AIAlertsPanel';
import { SmartSearch } from '@/app/components/SmartSearch';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { useAI } from '@/app/contexts/AIContext';

interface AIDashboardProps {
  onNavigate?: (page: string) => void;
}

export const AIDashboard: React.FC<AIDashboardProps> = ({ onNavigate }) => {
  const { predictions, pricingSuggestions, detectedErrors, recentAlerts, recentStockUpdates } = useAI();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const aiFeatures = [
    {
      icon: Activity,
      title: 'Real-Time Updates',
      description: 'Live inventory tracking',
      count: recentStockUpdates.length,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Brain,
      title: 'Predictive Analytics',
      description: 'Demand forecasting',
      count: predictions.length,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: AlertTriangle,
      title: 'Error Detection',
      description: 'Anomaly identification',
      count: detectedErrors.length,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: DollarSign,
      title: 'Dynamic Pricing',
      description: 'AI pricing optimization',
      count: pricingSuggestions.length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'AI Dashboard', path: 'ai-dashboard' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            AI-Powered Inventory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Leverage artificial intelligence for smarter inventory management
          </p>
        </div>
        <Button onClick={() => setSearchOpen(true)} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Smart Search
        </Button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {feature.count}
                  </Badge>
                </div>
                <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Capabilities Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                AI Features Available
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  10 Features
                </Badge>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Real-time stock updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>Predictive analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Smart search & filters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Automated alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  <span>Product recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>Error detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Visual analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>Voice & chat integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Dynamic pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>Auto categorization</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="errors" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Errors</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeStockUpdates />
            <AIAlertsPanel />
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-3xl font-bold text-green-600">98%</p>
                  <p className="text-sm text-slate-500 mt-1">Prediction Accuracy</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-3xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-slate-500 mt-1">Real-time Monitoring</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-3xl font-bold text-purple-600">85%</p>
                  <p className="text-sm text-slate-500 mt-1">Cost Savings</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-3xl font-bold text-orange-600">2.5x</p>
                  <p className="text-sm text-slate-500 mt-1">Efficiency Boost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-6">
          <ErrorDetectionPanel />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Demand Spike Detected</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Electronics category shows 35% increase in demand. Consider increasing stock levels for wireless mice and keyboards.
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                        View Details →
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Pricing Opportunity</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        3 products are priced below market average. Adjusting prices could increase profit by 12-15%.
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                        Review Pricing →
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Stock Optimization</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Your inventory turnover rate improved by 22% this month. Current stock levels are optimal for forecasted demand.
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                        View Report →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Smart Search Dialog */}
      <SmartSearch 
        open={searchOpen} 
        onOpenChange={setSearchOpen}
      />
    </div>
  );
};
