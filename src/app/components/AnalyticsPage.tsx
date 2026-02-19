import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { QuickStat } from '@/app/components/QuickStats';
import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import { Switch } from '@/app/components/ui/switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui/table';
import { mockProducts, mockOrders, mockTransactions } from '@/app/data/mockData';
import { toast } from 'sonner';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [compareEnabled, setCompareEnabled] = useState(false);

  // Sales trend data map keyed by time range
  const salesTrendDataMap: Record<string, Array<{date: string; sales: number; orders: number; customers: number}>> = {
    '7d': [
      { date: 'Mon', sales: 1100, orders: 4, customers: 3 },
      { date: 'Tue', sales: 1450, orders: 5, customers: 4 },
      { date: 'Wed', sales: 980, orders: 3, customers: 2 },
      { date: 'Thu', sales: 1720, orders: 6, customers: 5 },
      { date: 'Fri', sales: 2100, orders: 7, customers: 6 },
      { date: 'Sat', sales: 2450, orders: 8, customers: 7 },
      { date: 'Sun', sales: 1800, orders: 6, customers: 5 },
    ],
    '30d': [
      { date: 'Wk 1', sales: 6200, orders: 18, customers: 14 },
      { date: 'Wk 2', sales: 7100, orders: 21, customers: 16 },
      { date: 'Wk 3', sales: 8500, orders: 25, customers: 19 },
      { date: 'Wk 4', sales: 9200, orders: 28, customers: 21 },
    ],
    '90d': [
      { date: 'Month 1', sales: 22000, orders: 65, customers: 48 },
      { date: 'Month 2', sales: 28500, orders: 84, customers: 62 },
      { date: 'Month 3', sales: 31200, orders: 92, customers: 71 },
    ],
    '1y': [
      { date: 'Jan', sales: 4200, orders: 12, customers: 8 },
      { date: 'Feb', sales: 5100, orders: 15, customers: 11 },
      { date: 'Mar', sales: 4800, orders: 14, customers: 10 },
      { date: 'Apr', sales: 6200, orders: 18, customers: 14 },
      { date: 'May', sales: 7100, orders: 21, customers: 16 },
      { date: 'Jun', sales: 6900, orders: 19, customers: 15 },
      { date: 'Jul', sales: 8200, orders: 24, customers: 18 },
      { date: 'Aug', sales: 7800, orders: 23, customers: 17 },
      { date: 'Sep', sales: 9100, orders: 27, customers: 21 },
      { date: 'Oct', sales: 10200, orders: 30, customers: 23 },
      { date: 'Nov', sales: 11500, orders: 34, customers: 26 },
      { date: 'Dec', sales: 13200, orders: 39, customers: 30 },
    ],
  };

  const activeSalesData = salesTrendDataMap[timeRange];

  // Calculate KPIs from active dataset
  const totalRevenue = activeSalesData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrdersCount = activeSalesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrdersCount;
  const totalProducts = mockProducts.length;

  // Prior period data for comparison
  const priorPeriodData = activeSalesData.map(row => ({
    ...row,
    priorSales: Math.round(row.sales * 0.82),
  }));

  // Category performance
  const categoryPerformance = [
    { category: 'Electronics', revenue: 15000, orders: 45, growth: 12 },
    { category: 'Clothing', revenue: 12000, orders: 38, growth: 8 },
    { category: 'Food', revenue: 8000, orders: 52, growth: -5 },
    { category: 'Books', revenue: 5000, orders: 28, growth: 15 },
    { category: 'Toys', revenue: 4500, orders: 22, growth: 20 },
  ];

  // Top products
  const topProductsData = [
    { name: 'Product A', value: 4500 },
    { name: 'Product B', value: 3800 },
    { name: 'Product C', value: 3200 },
    { name: 'Product D', value: 2900 },
    { name: 'Others', value: 8600 },
  ];

  // Inventory health
  const inventoryHealthData = [
    { status: 'In Stock', count: 45, value: 75 },
    { status: 'Low Stock', count: 12, value: 20 },
    { status: 'Out of Stock', count: 3, value: 5 },
  ];

  // Performance metrics
  const performanceData = [
    { metric: 'Sales', value: 90, fullMark: 100 },
    { metric: 'Inventory', value: 75, fullMark: 100 },
    { metric: 'Orders', value: 85, fullMark: 100 },
    { metric: 'Customer', value: 80, fullMark: 100 },
    { metric: 'Delivery', value: 70, fullMark: 100 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // CSV export handler
  const handleExportCSV = () => {
    const data = activeSalesData;
    const csv = [
      'Period,Sales,Orders,Customers',
      ...data.map(row => `${row.date},${row.sales},${row.orders},${row.customers}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV export started');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Analytics
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-xs sm:text-sm"
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 text-xs sm:text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <div className="flex items-center gap-2">
            <Switch
              checked={compareEnabled}
              onCheckedChange={setCompareEnabled}
              id="compare-toggle"
            />
            <label htmlFor="compare-toggle" className="text-xs sm:text-sm text-slate-600 cursor-pointer whitespace-nowrap">
              Compare period
            </label>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <QuickStat
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12.5, label: 'vs last period' }}
          color="green"
        />
        <QuickStat
          title="Total Orders"
          value={totalOrdersCount}
          icon={ShoppingCart}
          trend={{ value: 8.2, label: 'vs last period' }}
          color="blue"
        />
        <QuickStat
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: -3.1, label: 'vs last period' }}
          color="purple"
        />
        <QuickStat
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="orange"
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="sales" className="text-xs sm:text-sm">Sales</TabsTrigger>
          <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Sales Trend */}
          <Card className="shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={compareEnabled ? priorPeriodData : activeSalesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                  {compareEnabled && (
                    <Area
                      dataKey="priorSales"
                      stroke="#94a3b8"
                      fill="none"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      name="Prior Period"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Category Performance */}
            <Card className="shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Category Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inventory Health */}
            <Card className="shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Inventory Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inventoryHealthData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, value }) => `${status}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inventoryHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4 sm:space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Multi-Metric Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={compareEnabled ? priorPeriodData : activeSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={2} />
                  {compareEnabled && (
                    <Line
                      dataKey="priorSales"
                      stroke="#94a3b8"
                      fill="none"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      name="Prior Period"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Period Summary Table */}
          <Card className="shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Period Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Customers</TableHead>
                    <TableHead className="text-right">Avg Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSalesData.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell className="text-right">${row.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.orders}</TableCell>
                      <TableCell className="text-right">{row.customers}</TableCell>
                      <TableCell className="text-right">${(row.sales / row.orders).toFixed(0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Top Products by Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProductsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topProductsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  Category Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  {categoryPerformance.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{category.category}</span>
                        <div className="flex items-center gap-2">
                          {category.growth > 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-semibold ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.growth}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={Math.abs(category.growth) * 5}
                        className={`h-2 ${category.growth < 0 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Performance Radar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
