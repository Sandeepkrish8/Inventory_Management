import React, { useState } from 'react';
import { PurchaseOrder, PurchaseOrderStatus } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
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
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Separator } from '@/app/components/ui/separator';
import {
  Search,
  Plus,
  Eye,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AccessDenied } from '@/app/components/AccessDenied';

export const PurchaseOrdersPage: React.FC = () => {
  const { user } = useAuth();
  
  // Block Viewer role from accessing this page
  if (user?.role === 'Viewer') {
    return <AccessDenied message="You don't have permission to access this page. This page is restricted to Staff and Admin users only." />;
  }
  
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PurchaseOrderStatus>('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    const variants = {
      Draft: { variant: 'secondary' as const, icon: FileText },
      Pending: { variant: 'default' as const, icon: Clock },
      Approved: { variant: 'default' as const, icon: CheckCircle },
      Received: { variant: 'default' as const, icon: Package },
      Cancelled: { variant: 'destructive' as const, icon: XCircle },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter(po => po.status === 'Pending').length,
    approved: purchaseOrders.filter(po => po.status === 'Approved').length,
    received: purchaseOrders.filter(po => po.status === 'Received').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Purchase Orders' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Purchase Orders
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage supplier purchase orders
          </p>
        </div>
        {canEdit && (
          <Button className="gap-2" onClick={() => toast.info('Create PO feature coming soon')}>
            <Plus className="w-4 h-4" />
            New Purchase Order
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total POs</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Pending</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Approved</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.approved}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Received</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.received}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by PO number or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Purchase Orders List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPOs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No purchase orders found</p>
              {canEdit && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => toast.info('Create PO feature coming soon')}
                >
                  Create Your First PO
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{po.supplierName}</TableCell>
                      <TableCell>{format(new Date(po.orderDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-semibold">${po.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPO(po)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View PO Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Purchase Order Details
            </DialogTitle>
            <DialogDescription>
              {selectedPO?.poNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-500">Supplier</Label>
                  <p className="font-medium">{selectedPO.supplierName}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPO.status)}</div>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Order Date</Label>
                  <p className="font-medium">{format(new Date(selectedPO.orderDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Created By</Label>
                  <p className="font-medium">{selectedPO.createdBy}</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold mb-2 block">Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${selectedPO.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedPO.notes && (
                <div>
                  <Label className="text-xs text-slate-500">Notes</Label>
                  <p className="text-sm mt-1">{selectedPO.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
