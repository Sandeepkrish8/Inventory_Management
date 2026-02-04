import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { mockDashboardMetrics, mockProducts, mockOrders, mockTransactions, mockCategories } from '@/app/data/mockData';
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Activity,
  Sparkles,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const metrics = mockDashboardMetrics;
  const lowStockProducts = mockProducts.filter(p => p.quantity <= p.minStockLevel);
  const recentOrders = mockOrders.slice(0, 5);
  const recentTransactions = mockTransactions.slice(0, 6);

  // Mock revenue data for chart
  const revenueData = [
    { month: 'Jan', revenue: 4200, orders: 12 },
    { month: 'Feb', revenue: 5100, orders: 15 },
    { month: 'Mar', revenue: 4800, orders: 14 },
    { month: 'Apr', revenue: 6200, orders: 18 },
    { month: 'May', revenue: 7100, orders: 21 },
    { month: 'Jun', revenue: 6900, orders: 19 },
  ];

  // Category distribution for pie chart
  const categoryData = mockCategories.map(cat => ({
    name: cat.name,
    value: cat.productCount,
  }));

  // Stock status distribution
  const stockStatusData = [
    { name: 'In Stock', value: mockProducts.filter(p => p.quantity > p.minStockLevel).length },
    { name: 'Low Stock', value: mockProducts.filter(p => p.quantity <= p.minStockLevel && p.quantity > 0).length },
    { name: 'Out of Stock', value: mockProducts.filter(p => p.quantity === 0).length },
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];
  const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const stats = [
    {
      title: 'Total Products',
      value: metrics.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Active products',
    },
    {
      title: 'Low Stock Alerts',
      value: metrics.lowStockAlerts,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Need attention',
    },
    {
      title: 'Recent Orders',
      value: metrics.recentOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      change: metrics.ordersChange,
      description: 'This month',
    },
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      change: metrics.revenueChange,
      description: 'This month',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Dashboard
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Activity className="w-4 h-4" />
          View Reports
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16`}></div>
              <CardContent className="p-4 sm:p-6 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.description}</p>
                    {stat.change !== undefined && (
                      <div className="flex items-center gap-1 mt-2 sm:mt-3">
                        {stat.change > 0 ? (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                        )}
                        <span className={`text-xs sm:text-sm font-medium ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(stat.change)}%
                        </span>
                        <span className="text-xs text-slate-500 hidden sm:inline">vs last month</span>
                      </div>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 sm:p-4 rounded-xl shadow-lg transition-transform hover:scale-110 hover:rotate-6 flex-shrink-0`}>
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Trend Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              Revenue Trend
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-500">Monthly revenue and order statistics</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Status Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              Stock Status Distribution
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-500">Current inventory health status</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    fontSize: '12px'
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            Category Performance
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-500">Product distribution by category</p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Section - Activities & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg h-full hover:shadow-xl transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                  <span className="truncate">Low Stock Alerts</span>
                </span>
                <Badge variant="destructive" className="flex-shrink-0">{lowStockProducts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No low stock items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-md transition-all hover:scale-105"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                        <Progress 
                          value={(product.quantity / product.minStockLevel) * 100} 
                          className="h-1.5 mt-2"
                        />
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-orange-600 text-base sm:text-lg">{product.quantity}</p>
                        <p className="text-xs text-slate-500">Min: {product.minStockLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg h-full hover:shadow-xl transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all hover:scale-105 cursor-pointer"
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      transaction.type === 'stock_in' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {transaction.type === 'stock_in' ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{transaction.productName}</p>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">
                        {transaction.type === 'stock_in' ? 'Stock In' : 'Stock Out'} • {transaction.performedBy}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-semibold text-sm sm:text-base ${
                        transaction.type === 'stock_in' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {transaction.type === 'stock_in' ? '+' : '-'}{transaction.quantity}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(transaction.date), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2 text-sm sm:text-base">
                View All Activity
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};