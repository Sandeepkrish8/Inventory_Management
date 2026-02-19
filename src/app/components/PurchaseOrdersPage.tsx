import React, { useState } from 'react';
import { PurchaseOrder, PurchaseOrderStatus, PurchaseOrderItem } from '@/app/types';
import { mockPurchaseOrders, mockSuppliers, mockProducts } from '@/app/data/mockData';
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
  TrendingUp,
  DollarSign,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AccessDenied } from '@/app/components/AccessDenied';

// ── Form state types ──────────────────────────────────────────────────────────

interface CreatePOLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface CreatePOFormState {
  supplierId: string;
  supplierName: string;
  expectedDate: string;
  notes: string;
  lineItems: CreatePOLineItem[];
}

const emptyForm = (): CreatePOFormState => ({
  supplierId: '',
  supplierName: '',
  expectedDate: '',
  notes: '',
  lineItems: [{ productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }],
});

// ─────────────────────────────────────────────────────────────────────────────

export const PurchaseOrdersPage: React.FC = () => {
  const { user } = useAuth();

  // Block Viewer role from accessing this page
  if (user?.role === 'Viewer') {
    return <AccessDenied message="You don't have permission to access this page. This page is restricted to Staff and Admin users only." />;
  }

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PurchaseOrderStatus>('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createPOOpen, setCreatePOOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePOFormState>(emptyForm());

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  // ── Derived stats ───────────────────────────────────────────────────────────

  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter(po => po.status === 'Pending').length,
    approved: purchaseOrders.filter(po => po.status === 'Approved').length,
    received: purchaseOrders.filter(po => po.status === 'Received').length,
  };

  const totalValue = purchaseOrders
    .filter(po => po.status !== 'Cancelled')
    .reduce((sum, po) => sum + po.total, 0);

  // ── Filtering ───────────────────────────────────────────────────────────────

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleViewPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setViewDialogOpen(true);
  };

  const handleStatusUpdate = (poId: string, newStatus: PurchaseOrderStatus) => {
    setPurchaseOrders(pos =>
      pos.map(po =>
        po.id === poId
          ? {
              ...po,
              status: newStatus,
              receivedDate:
                newStatus === 'Received' ? new Date().toISOString() : po.receivedDate,
            }
          : po
      )
    );
    toast.success(`PO status updated to ${newStatus}`);
    setViewDialogOpen(false);
  };

  const handleCreatePO = (status: PurchaseOrderStatus) => {
    if (!createForm.supplierId) {
      toast.error('Please select a supplier.');
      return;
    }
    if (createForm.lineItems.some(li => !li.productId || li.quantity <= 0)) {
      toast.error('Please fill in all line items with a product and valid quantity.');
      return;
    }

    const validItems: PurchaseOrderItem[] = createForm.lineItems
      .filter(li => li.productId)
      .map(li => ({
        productId: li.productId,
        productName: li.productName,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        total: li.quantity * li.unitPrice,
      }));

    const total = validItems.reduce((sum, item) => sum + item.total, 0);

    const newPO: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      poNumber: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplierId: createForm.supplierId,
      supplierName: createForm.supplierName,
      items: validItems,
      total,
      status,
      orderDate: new Date().toISOString(),
      expectedDate: createForm.expectedDate ? new Date(createForm.expectedDate).toISOString() : undefined,
      notes: createForm.notes || undefined,
      createdBy: user?.name ?? 'Unknown',
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    toast.success(`Purchase order ${newPO.poNumber} created as ${status}.`);
    setCreatePOOpen(false);
    setCreateForm(emptyForm());
  };

  // ── Create-PO form helpers ──────────────────────────────────────────────────

  const handleSupplierChange = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    setCreateForm(f => ({
      ...f,
      supplierId,
      supplierName: supplier?.name ?? '',
    }));
  };

  const handleLineItemProductChange = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    setCreateForm(f => {
      const lineItems = [...f.lineItems];
      lineItems[index] = {
        ...lineItems[index],
        productId,
        productName: product?.name ?? '',
        unitPrice: product?.unitPrice ?? 0,
        total: (lineItems[index].quantity) * (product?.unitPrice ?? 0),
      };
      return { ...f, lineItems };
    });
  };

  const handleLineItemQuantityChange = (index: number, quantity: number) => {
    setCreateForm(f => {
      const lineItems = [...f.lineItems];
      lineItems[index] = {
        ...lineItems[index],
        quantity,
        total: quantity * lineItems[index].unitPrice,
      };
      return { ...f, lineItems };
    });
  };

  const handleLineItemUnitPriceChange = (index: number, unitPrice: number) => {
    setCreateForm(f => {
      const lineItems = [...f.lineItems];
      lineItems[index] = {
        ...lineItems[index],
        unitPrice,
        total: lineItems[index].quantity * unitPrice,
      };
      return { ...f, lineItems };
    });
  };

  const handleAddLineItem = () => {
    setCreateForm(f => ({
      ...f,
      lineItems: [
        ...f.lineItems,
        { productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 },
      ],
    }));
  };

  const handleRemoveLineItem = (index: number) => {
    setCreateForm(f => ({
      ...f,
      lineItems: f.lineItems.filter((_, i) => i !== index),
    }));
  };

  const createFormTotal = createForm.lineItems.reduce((sum, li) => sum + li.total, 0);

  // ── Status badge ────────────────────────────────────────────────────────────

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

  // ── Status progression helper ───────────────────────────────────────────────

  const getNextAction = (
    status: PurchaseOrderStatus
  ): { label: string; next: PurchaseOrderStatus } | null => {
    switch (status) {
      case 'Draft':
        return { label: 'Submit for Approval', next: 'Pending' };
      case 'Pending':
        return { label: 'Approve PO', next: 'Approved' };
      case 'Approved':
        return { label: 'Mark as Received', next: 'Received' };
      default:
        return null;
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

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
          <Button className="gap-2" onClick={() => setCreatePOOpen(true)}>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Value</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
                  onClick={() => setCreatePOOpen(true)}
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

      {/* ── View PO Dialog ─────────────────────────────────────────────────── */}
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
                {selectedPO.expectedDate && (
                  <div>
                    <Label className="text-xs text-slate-500">Expected Delivery</Label>
                    <p className="font-medium">{format(new Date(selectedPO.expectedDate), 'MMM dd, yyyy')}</p>
                  </div>
                )}
                {selectedPO.receivedDate && (
                  <div>
                    <Label className="text-xs text-slate-500">Received Date</Label>
                    <p className="font-medium">{format(new Date(selectedPO.receivedDate), 'MMM dd, yyyy')}</p>
                  </div>
                )}
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
          <DialogFooter className="flex flex-wrap gap-2 sm:justify-end">
            {canEdit && selectedPO && (() => {
              const nextAction = getNextAction(selectedPO.status);
              const canCancel =
                selectedPO.status !== 'Received' && selectedPO.status !== 'Cancelled';
              return (
                <>
                  {canCancel && (
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate(selectedPO.id, 'Cancelled')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel PO
                    </Button>
                  )}
                  {nextAction && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedPO.id, nextAction.next)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {nextAction.label}
                    </Button>
                  )}
                </>
              );
            })()}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create PO Dialog ───────────────────────────────────────────────── */}
      <Dialog open={createPOOpen} onOpenChange={(open) => {
        setCreatePOOpen(open);
        if (!open) setCreateForm(emptyForm());
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Create New Purchase Order
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new purchase order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Supplier & Expected Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-supplier">Supplier <span className="text-red-500">*</span></Label>
                <Select
                  value={createForm.supplierId}
                  onValueChange={handleSupplierChange}
                >
                  <SelectTrigger id="create-supplier">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="create-expected-date">Expected Delivery Date</Label>
                <Input
                  id="create-expected-date"
                  type="date"
                  value={createForm.expectedDate}
                  onChange={e => setCreateForm(f => ({ ...f, expectedDate: e.target.value }))}
                />
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Line Items <span className="text-red-500">*</span></Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLineItem}
                  className="gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </Button>
              </div>

              {/* Header row (desktop) */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_100px_110px_100px_36px] gap-2 px-1">
                <span className="text-xs font-medium text-slate-500">Product</span>
                <span className="text-xs font-medium text-slate-500">Qty</span>
                <span className="text-xs font-medium text-slate-500">Unit Price</span>
                <span className="text-xs font-medium text-slate-500 text-right">Line Total</span>
                <span />
              </div>

              {createForm.lineItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_100px_110px_100px_36px] gap-2 items-center border border-slate-100 dark:border-slate-700 rounded-md p-2 sm:border-none sm:p-0"
                >
                  {/* Product select */}
                  <Select
                    value={item.productId}
                    onValueChange={val => handleLineItemProductChange(index, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Quantity */}
                  <Input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={e => handleLineItemQuantityChange(index, Number(e.target.value))}
                  />

                  {/* Unit Price */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={item.unitPrice}
                      onChange={e => handleLineItemUnitPriceChange(index, Number(e.target.value))}
                      className="pl-6"
                    />
                  </div>

                  {/* Line Total (read-only) */}
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-500 justify-self-end sm:justify-self-auto"
                    onClick={() => handleRemoveLineItem(index)}
                    disabled={createForm.lineItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* PO Total Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-300">PO Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${createFormTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="create-notes">Notes</Label>
              <Textarea
                id="create-notes"
                placeholder="Add any notes or special instructions..."
                rows={3}
                value={createForm.notes}
                onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setCreatePOOpen(false);
                setCreateForm(emptyForm());
              }}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleCreatePO('Draft')}
            >
              <FileText className="w-4 h-4 mr-1" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleCreatePO('Pending')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
