import React, { useState } from 'react';
import { mockOrders } from '@/app/data/mockData';
import { Order, OrderStatus } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Separator } from '@/app/components/ui/separator';
import { Eye, Filter, ShoppingCart, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export const OrdersPage: React.FC = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // Sort by date (most recent first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusClassName = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200';
    }
  };

  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const totalRevenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Orders</h2>
          <p className="text-slate-500 mt-1">View and manage customer orders</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-2xl font-semibold text-slate-900">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-semibold text-slate-900">{completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-2xl font-semibold text-slate-900">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <span className="text-xl font-semibold text-purple-600">$</span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Revenue</p>
                <p className="text-2xl font-semibold text-slate-900">
                  ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Pending">Pending Only</SelectItem>
                <SelectItem value="Completed">Completed Only</SelectItem>
                <SelectItem value="Cancelled">Cancelled Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {sortedOrders.length} Order{sortedOrders.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">{order.items.length}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={getStatusClassName(order.status) + ' gap-1'}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              {selectedOrder && (
                <Badge 
                  className={getStatusClassName(selectedOrder.status) + ' gap-1'}
                >
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete order information and items
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order Number</p>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Order Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                {selectedOrder.completedAt && (
                  <div>
                    <p className="text-sm text-slate-500">Completed Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedOrder.completedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-semibold text-blue-600">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
