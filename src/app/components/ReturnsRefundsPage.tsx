import React, { useState } from 'react';
import { Return, ReturnStatus, ReturnType, RefundStatus } from '@/app/types';
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
import { Separator } from '@/app/components/ui/separator';
import {
  Search,
  Plus,
  Eye,
  Filter,
  RotateCcw,
  Users,
  Truck,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { mockReturns } from '@/app/data/mockData';
import { AccessDenied } from '@/app/components/AccessDenied';

export const ReturnsRefundsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Block Viewer role from accessing this page
  if (user?.role === 'Viewer') {
    return <AccessDenied message="You don't have permission to access this page. This page is restricted to Staff and Admin users only." />;
  }
  
  const [returns, setReturns] = useState<Return[]>(mockReturns);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ReturnType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ReturnStatus>('all');
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredReturns = returns.filter((ret) => {
    const matchesSearch = 
      ret.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.supplierName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || ret.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleApprove = (returnId: string) => {
    setReturns(returns.map(ret =>
      ret.id === returnId
        ? {
            ...ret,
            status: 'Approved' as ReturnStatus,
            approvedDate: new Date().toISOString(),
            refundStatus: 'Approved' as RefundStatus
          }
        : ret
    ));
    toast.success('Return approved');
  };

  const handleReject = (returnId: string) => {
    setReturns(returns.map(ret =>
      ret.id === returnId
        ? {
            ...ret,
            status: 'Rejected' as ReturnStatus,
            refundStatus: 'Rejected' as RefundStatus
          }
        : ret
    ));
    toast.success('Return rejected');
  };

  const handleComplete = (returnId: string) => {
    setReturns(returns.map(ret =>
      ret.id === returnId
        ? {
            ...ret,
            status: 'Completed' as ReturnStatus,
            completedDate: new Date().toISOString(),
            refundStatus: 'Processed' as RefundStatus
          }
        : ret
    ));
    toast.success('Return completed and refund processed');
  };

  const getStatusBadge = (status: ReturnStatus) => {
    const variants = {
      Pending: { variant: 'default' as const, icon: Clock, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
      Approved: { variant: 'default' as const, icon: CheckCircle, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
      Rejected: { variant: 'destructive' as const, icon: XCircle },
      Completed: { variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className || ''}`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getRefundBadge = (status?: RefundStatus) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>;

    const variants = {
      Pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      Approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      Processed: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      Rejected: '',
    };

    return (
      <Badge variant={status === 'Rejected' ? 'destructive' : 'default'} className={variants[status]}>
        {status}
      </Badge>
    );
  };

  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'Pending').length,
    approved: returns.filter(r => r.status === 'Approved').length,
    totalRefunds: returns
      .filter(r => r.refundStatus === 'Processed')
      .reduce((sum, r) => sum + r.total, 0),
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Returns & Refunds' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Returns & Refunds
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage customer and supplier returns
          </p>
        </div>
        {canEdit && (
          <Button className="gap-2" onClick={() => toast.info('Create return feature coming soon')}>
            <Plus className="w-4 h-4" />
            New Return
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Returns</p>
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
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Refunds</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  ${stats.totalRefunds.toFixed(0)}
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
                placeholder="Search by return number, customer, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Customer Return">Customer Return</SelectItem>
                <SelectItem value="Supplier Return">Supplier Return</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Returns List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredReturns.length === 0 ? (
            <div className="text-center py-12">
              <RotateCcw className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No returns found</p>
              {canEdit && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => toast.info('Create return feature coming soon')}
                >
                  Create Return Request
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer/Supplier</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refund Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReturns.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {ret.type === 'Customer Return' ? (
                            <Users className="w-3 h-3" />
                          ) : (
                            <Truck className="w-3 h-3" />
                          )}
                          {ret.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{ret.customerName || ret.supplierName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ret.reason}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">${ret.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(ret.status)}</TableCell>
                      <TableCell>{getRefundBadge(ret.refundStatus)}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(ret.requestDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReturn(ret);
                            setViewDialogOpen(true);
                          }}
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

      {/* View Return Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              Return Details
            </DialogTitle>
            <DialogDescription>
              {selectedReturn?.returnNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
                  <Badge variant="outline" className="gap-1 mt-1">
                    {selectedReturn.type === 'Customer Return' ? (
                      <Users className="w-3 h-3" />
                    ) : (
                      <Truck className="w-3 h-3" />
                    )}
                    {selectedReturn.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedReturn.status)}</div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedReturn.type === 'Customer Return' ? 'Customer' : 'Supplier'}
                  </p>
                  <p className="font-medium">{selectedReturn.customerName || selectedReturn.supplierName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reason</p>
                  <Badge variant="secondary" className="mt-1">{selectedReturn.reason}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Request Date</p>
                  <p className="font-medium">{format(new Date(selectedReturn.requestDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Refund Status</p>
                  <div className="mt-1">{getRefundBadge(selectedReturn.refundStatus)}</div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-2">Items</p>
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
                    {selectedReturn.items.map((item, index) => (
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
                    ${selectedReturn.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedReturn.notes && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Notes</p>
                  <p className="text-sm mt-1">{selectedReturn.notes}</p>
                </div>
              )}

              {canEdit && selectedReturn.status === 'Pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      handleApprove(selectedReturn.id);
                      setViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleReject(selectedReturn.id);
                      setViewDialogOpen(false);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {canEdit && selectedReturn.status === 'Approved' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleComplete(selectedReturn.id);
                      setViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete & Process Refund
                  </Button>
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
