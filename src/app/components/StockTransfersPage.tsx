import React, { useState } from 'react';
import { StockTransfer, Location, Product } from '@/app/types';
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
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  ArrowRightLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Textarea } from '@/app/components/ui/textarea';
import { mockStockTransfers } from '@/app/data/mockData';
import { AccessDenied } from '@/app/components/AccessDenied';

export const StockTransfersPage: React.FC = () => {
  const { user } = useAuth();
  
  // Block Viewer role from accessing this page
  if (user?.role === 'Viewer') {
    return <AccessDenied message="You don't have permission to access this page. This page is restricted to Staff and Admin users only." />;
  }
  
  const [transfers, setTransfers] = useState<StockTransfer[]>(mockStockTransfers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StockTransfer['status']>('all');
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StockTransfer>>({});
  const [transferItems, setTransferItems] = useState<StockTransfer['items']>([]);

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch = 
      transfer.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromLocationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toLocationName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditTransfer = (transfer: StockTransfer) => {
    setFormData(transfer);
    setTransferItems(transfer.items);
    setEditDialogOpen(true);
  };

  const handleDeleteTransfer = (transferId: string) => {
    if (confirm('Are you sure you want to delete this transfer?')) {
      setTransfers(transfers.filter(t => t.id !== transferId));
      toast.success('Transfer deleted successfully');
    }
  };

  const handleSaveTransfer = () => {
    if (!formData.fromLocationId || !formData.toLocationId || transferItems.length === 0) {
      toast.error('Please select locations and add at least one item');
      return;
    }

    if (formData.fromLocationId === formData.toLocationId) {
      toast.error('Source and destination locations must be different');
      return;
    }

    const totalQuantity = transferItems.reduce((sum, item) => sum + item.quantity, 0);

    if (formData.id) {
      setTransfers(transfers.map(t => t.id === formData.id ? { 
        ...formData as StockTransfer,
        items: transferItems,
        totalQuantity,
        lastModifiedAt: new Date().toISOString(),
        lastModifiedBy: user?.name
      } : t));
      toast.success('Transfer updated successfully');
    } else {
      const newTransfer: StockTransfer = {
        ...formData as StockTransfer,
        id: `TRF${Date.now()}`,
        transferNumber: `TRF-${Date.now().toString().slice(-6)}`,
        status: 'Pending',
        items: transferItems,
        totalQuantity,
        createdAt: new Date().toISOString(),
        createdBy: user?.name
      };
      setTransfers([...transfers, newTransfer]);
      toast.success('Transfer created successfully');
    }

    setEditDialogOpen(false);
    setFormData({});
    setTransferItems([]);
  };

  const handleAddItem = () => {
    setTransferItems([...transferItems, {
      productId: '',
      productName: '',
      sku: '',
      quantity: 1
    }]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...transferItems];
    updated[index] = { ...updated[index], [field]: value };
    setTransferItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setTransferItems(transferItems.filter((_, i) => i !== index));
  };

  const handleApprove = (transferId: string) => {
    setTransfers(transfers.map(t => 
      t.id === transferId 
        ? { 
            ...t, 
            status: 'Approved',
            approvedAt: new Date().toISOString(),
            approvedBy: user?.name,
            lastModifiedAt: new Date().toISOString(),
            lastModifiedBy: user?.name
          }
        : t
    ));
    toast.success('Transfer approved successfully');
  };

  const handleShip = (transferId: string) => {
    setTransfers(transfers.map(t => 
      t.id === transferId 
        ? { 
            ...t, 
            status: 'In Transit',
            shippedAt: new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            lastModifiedBy: user?.name
          }
        : t
    ));
    toast.success('Transfer marked as shipped');
  };

  const handleReceive = (transferId: string) => {
    setTransfers(transfers.map(t => 
      t.id === transferId 
        ? { 
            ...t, 
            status: 'Received',
            receivedAt: new Date().toISOString(),
            receivedBy: user?.name,
            lastModifiedAt: new Date().toISOString(),
            lastModifiedBy: user?.name
          }
        : t
    ));
    toast.success('Transfer received successfully');
  };

  const handleCancel = (transferId: string) => {
    if (confirm('Are you sure you want to cancel this transfer?')) {
      setTransfers(transfers.map(t => 
        t.id === transferId 
          ? { 
              ...t, 
              status: 'Cancelled',
              lastModifiedAt: new Date().toISOString(),
              lastModifiedBy: user?.name
            }
          : t
      ));
      toast.success('Transfer cancelled');
    }
  };

  const getStatusBadge = (status: StockTransfer['status']) => {
    const variants = {
      Pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
      Approved: { variant: 'default' as const, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: CheckCircle },
      'In Transit': { variant: 'default' as const, className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck },
      Received: { variant: 'default' as const, className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
      Cancelled: { variant: 'destructive' as const, icon: XCircle },
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

  const stats = {
    total: transfers.length,
    pending: transfers.filter(t => t.status === 'Pending').length,
    inTransit: transfers.filter(t => t.status === 'In Transit').length,
    received: transfers.filter(t => t.status === 'Received').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Stock Transfers' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Stock Transfers
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Transfer inventory between locations
          </p>
        </div>
        {canEdit && (
          <Button 
            className="gap-2" 
            onClick={() => {
              setFormData({});
              setTransferItems([]);
              setEditDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            New Transfer
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Transfers</p>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">In Transit</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.inTransit}
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
                placeholder="Search by transfer number or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Transfer Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransfers.length === 0 ? (
            <div className="text-center py-12">
              <ArrowRightLeft className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No transfers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer #</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono text-sm">{transfer.transferNumber}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {transfer.fromLocationName || transfer.fromLocationId}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {transfer.toLocationName || transfer.toLocationId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transfer.items.length} items</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(transfer.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTransfer(transfer);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canEdit && transfer.status === 'Pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTransfer(transfer)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTransfer(transfer.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Transfer Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              Transfer Details
            </DialogTitle>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Transfer Number</p>
                  <p className="font-mono font-medium">{selectedTransfer.transferNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedTransfer.status)}</div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">From Location</p>
                  <p className="font-medium">{selectedTransfer.fromLocationName || selectedTransfer.fromLocationId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">To Location</p>
                  <p className="font-medium">{selectedTransfer.toLocationName || selectedTransfer.toLocationId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                  <p className="font-medium">{format(new Date(selectedTransfer.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Created By</p>
                  <p className="font-medium">{selectedTransfer.createdBy || '-'}</p>
                </div>
                {selectedTransfer.approvedAt && (
                  <>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Approved</p>
                      <p className="font-medium">{format(new Date(selectedTransfer.approvedAt), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Approved By</p>
                      <p className="font-medium">{selectedTransfer.approvedBy || '-'}</p>
                    </div>
                  </>
                )}
                {selectedTransfer.shippedAt && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Shipped</p>
                    <p className="font-medium">{format(new Date(selectedTransfer.shippedAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                )}
                {selectedTransfer.receivedAt && (
                  <>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Received</p>
                      <p className="font-medium">{format(new Date(selectedTransfer.receivedAt), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Received By</p>
                      <p className="font-medium">{selectedTransfer.receivedBy || '-'}</p>
                    </div>
                  </>
                )}
              </div>

              {selectedTransfer.notes && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notes</p>
                  <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    {selectedTransfer.notes}
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Transfer Items</p>
                <div className="space-y-2">
                  {selectedTransfer.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {item.sku}</p>
                      </div>
                      <Badge variant="outline">
                        <Package className="w-3 h-3 mr-1" />
                        {item.quantity} units
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                  Total: {selectedTransfer.totalQuantity} units
                </p>
              </div>

              {canEdit && (
                <div className="flex gap-2 pt-4 border-t">
                  {selectedTransfer.status === 'Pending' && (
                    <>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          handleApprove(selectedTransfer.id);
                          setViewDialogOpen(false);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleCancel(selectedTransfer.id);
                          setViewDialogOpen(false);
                        }}
                      >
                        Cancel Transfer
                      </Button>
                    </>
                  )}
                  {selectedTransfer.status === 'Approved' && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleShip(selectedTransfer.id);
                        setViewDialogOpen(false);
                      }}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Mark as Shipped
                    </Button>
                  )}
                  {selectedTransfer.status === 'In Transit' && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleReceive(selectedTransfer.id);
                        setViewDialogOpen(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Received
                    </Button>
                  )}
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

      {/* Edit/Add Transfer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Transfer' : 'Create New Transfer'}</DialogTitle>
            <DialogDescription>
              Transfer inventory between warehouse locations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromLocationId">From Location *</Label>
                <Input
                  id="fromLocationId"
                  value={formData.fromLocationId || ''}
                  onChange={(e) => setFormData({ ...formData, fromLocationId: e.target.value })}
                  placeholder="Source location ID"
                />
              </div>
              <div>
                <Label htmlFor="toLocationId">To Location *</Label>
                <Input
                  id="toLocationId"
                  value={formData.toLocationId || ''}
                  onChange={(e) => setFormData({ ...formData, toLocationId: e.target.value })}
                  placeholder="Destination location ID"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this transfer"
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <Label>Transfer Items *</Label>
                <Button size="sm" variant="outline" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {transferItems.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">No items added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transferItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="col-span-4">
                        <Input
                          placeholder="Product Name"
                          value={item.productName}
                          onChange={(e) => handleUpdateItem(index, 'productName', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="SKU"
                          value={item.sku}
                          onChange={(e) => handleUpdateItem(index, 'sku', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="Product ID"
                          value={item.productId}
                          onChange={(e) => handleUpdateItem(index, 'productId', e.target.value)}
                        />
                      </div>
                      <div className="col-span-12">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-600"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Item
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                    Total Items: {transferItems.length} | Total Quantity: {transferItems.reduce((sum, item) => sum + item.quantity, 0)} units
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              setFormData({});
              setTransferItems([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveTransfer}>
              {formData.id ? 'Update' : 'Create'} Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
