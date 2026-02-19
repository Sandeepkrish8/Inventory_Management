import React, { useState } from 'react';
import { mockOrders, mockProducts } from '@/app/data/mockData';
import { Order, OrderStatus } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Separator } from '@/app/components/ui/separator';
import {
  Eye,
  Filter,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Calendar,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7d' | '30d'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    items: [] as Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>,
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dateFilteredOrders = filteredOrders.filter((order) => {
    if (dateFilter === 'all') return true;
    const now = new Date();
    const orderDate = new Date(order.createdAt);
    const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    if (dateFilter === 'today') return diffDays < 1;
    if (dateFilter === '7d') return diffDays <= 7;
    if (dateFilter === '30d') return diffDays <= 30;
    return true;
  });

  // Sort by date (most recent first)
  const sortedOrders = [...dateFilteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / itemsPerPage));
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Orders</h2>
          <p className="text-slate-500 mt-1">View and manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              const csv = [
                'Order #,Customer,Date,Items,Total,Status',
                ...sortedOrders.map(
                  (o) =>
                    `${o.orderNumber},${o.customerName},${format(new Date(o.createdAt), 'yyyy-MM-dd')},${o.items.length},$${o.total.toFixed(2)},${o.status}`
                ),
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'orders.csv';
              a.click();
              URL.revokeObjectURL(url);
              toast.success('Orders exported');
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setCreateOrderOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Order
          </Button>
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="Search by order # or customer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <Select
                value={statusFilter}
                onValueChange={(value: any) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
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

            {/* Date filter */}
            <Select
              value={dateFilter}
              onValueChange={(v: any) => {
                setDateFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
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
                {paginatedOrders.map((order) => (
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
                      <Badge className={getStatusClassName(order.status) + ' gap-1'}>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, sortedOrders.length)} of{' '}
                {sortedOrders.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              {selectedOrder && (
                <Badge className={getStatusClassName(selectedOrder.status) + ' gap-1'}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>Complete order information and items</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status Timeline */}
              <div className="flex items-center gap-1 sm:gap-2">
                {[
                  {
                    label: 'Order Placed',
                    time: selectedOrder.createdAt,
                    done: true,
                    icon: ShoppingCart,
                    color: 'bg-blue-100 text-blue-600',
                  },
                  {
                    label: 'Processing',
                    time:
                      selectedOrder.status !== 'Pending'
                        ? new Date(
                            new Date(selectedOrder.createdAt).getTime() + 2 * 3600 * 1000
                          ).toISOString()
                        : null,
                    done: selectedOrder.status !== 'Pending',
                    icon: Clock,
                    color:
                      selectedOrder.status !== 'Pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-slate-100 text-slate-400',
                  },
                  {
                    label:
                      selectedOrder.status === 'Cancelled' ? 'Cancelled' : 'Completed',
                    time: selectedOrder.completedAt || null,
                    done:
                      selectedOrder.status === 'Completed' ||
                      selectedOrder.status === 'Cancelled',
                    icon:
                      selectedOrder.status === 'Cancelled' ? XCircle : CheckCircle,
                    color:
                      selectedOrder.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : selectedOrder.status === 'Cancelled'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100 text-slate-400',
                  },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.label}>
                    <div
                      className={`flex flex-col items-center gap-1 flex-1 ${
                        step.done ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step.color}`}
                      >
                        <step.icon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-center leading-tight">
                        {step.label}
                      </p>
                      {step.time && (
                        <p className="text-xs text-slate-400 text-center">
                          {format(new Date(step.time), 'MMM dd, HH:mm')}
                        </p>
                      )}
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mb-5 rounded ${
                          step.done ? 'bg-blue-300' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Separator />

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
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} x ${item.unitPrice.toFixed(2)}
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

      {/* Create New Order Dialog */}
      <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Fill in the order details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                placeholder="Enter customer name..."
                value={newOrderForm.customerName}
                onChange={(e) =>
                  setNewOrderForm({ ...newOrderForm, customerName: e.target.value })
                }
              />
            </div>

            {/* Add Item section */}
            <div className="space-y-2">
              <Label>Add Item</Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(productId) => {
                    const product = mockProducts.find((p) => p.id === productId);
                    if (product) {
                      setNewOrderForm((prev) => ({
                        ...prev,
                        items: [
                          ...prev.items,
                          {
                            productId: product.id,
                            productName: product.name,
                            quantity: 1,
                            unitPrice: product.sellingPrice,
                          },
                        ],
                      }));
                    }
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - ${p.sellingPrice.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Line items */}
            {newOrderForm.items.length > 0 && (
              <div className="space-y-2">
                <Label>Order Items</Label>
                {newOrderForm.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="flex-1 text-sm font-medium">{item.productName}</span>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 1;
                        setNewOrderForm((prev) => ({
                          ...prev,
                          items: prev.items.map((it, i) =>
                            i === index ? { ...it, quantity: qty } : it
                          ),
                        }));
                      }}
                      className="w-20"
                    />
                    <span className="text-sm text-slate-500">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setNewOrderForm((prev) => ({
                          ...prev,
                          items: prev.items.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <div className="bg-blue-50 p-3 rounded-lg flex justify-between font-semibold">
                  <span>Order Total</span>
                  <span className="text-blue-600">
                    $
                    {newOrderForm.items
                      .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setCreateOrderOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newOrderForm.customerName || newOrderForm.items.length === 0) {
                  toast.error('Please add customer name and at least one item');
                  return;
                }
                const total = newOrderForm.items.reduce(
                  (sum, i) => sum + i.quantity * i.unitPrice,
                  0
                );
                const order: Order = {
                  id: String(Date.now()),
                  orderNumber: `ORD-${1000 + orders.length + 1}`,
                  customerName: newOrderForm.customerName,
                  items: newOrderForm.items.map((i) => ({
                    productId: i.productId,
                    productName: i.productName,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    total: i.quantity * i.unitPrice,
                  })),
                  total,
                  status: 'Pending',
                  createdAt: new Date().toISOString(),
                };
                setOrders([order, ...orders]);
                setNewOrderForm({ customerName: '', items: [] });
                setCreateOrderOpen(false);
                toast.success('Order created successfully');
              }}
              disabled={!newOrderForm.customerName || newOrderForm.items.length === 0}
            >
              Create Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
