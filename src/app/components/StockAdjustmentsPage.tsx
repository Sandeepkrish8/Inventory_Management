import React, { useState } from 'react';
import { StockAdjustment, AdjustmentReason } from '@/app/types';
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
import {
  Search,
  Plus,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AccessDenied } from '@/app/components/AccessDenied';

export const StockAdjustmentsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Block Viewer role from accessing this page
  if (user?.role === 'Viewer') {
    return <AccessDenied message="You don't have permission to access this page. This page is restricted to Staff and Admin users only." />;
  }
  
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'increase' | 'decrease'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StockAdjustment>>({
    adjustmentType: 'increase',
    reason: 'Recount'
  });

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredAdjustments = adjustments.filter((adj) => {
    const matchesSearch = 
      adj.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || adj.adjustmentType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSaveAdjustment = () => {
    if (!formData.productId || !formData.productName || !formData.quantity || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAdjustment: StockAdjustment = {
      id: `ADJ${Date.now()}`,
      productId: formData.productId,
      productName: formData.productName,
      adjustmentType: formData.adjustmentType || 'increase',
      quantity: Number(formData.quantity),
      reason: formData.reason,
      notes: formData.notes,
      performedBy: user?.name || 'Unknown',
      date: new Date().toISOString(),
      reference: formData.reference
    };

    setAdjustments([newAdjustment, ...adjustments]);
    toast.success('Stock adjustment recorded successfully');
    setDialogOpen(false);
    setFormData({ adjustmentType: 'increase', reason: 'Recount' });
  };

  const stats = {
    total: adjustments.length,
    increases: adjustments.filter(a => a.adjustmentType === 'increase').reduce((sum, a) => sum + a.quantity, 0),
    decreases: adjustments.filter(a => a.adjustmentType === 'decrease').reduce((sum, a) => sum + a.quantity, 0),
    thisMonth: adjustments.filter(a => {
      const adjDate = new Date(a.date);
      const now = new Date();
      return adjDate.getMonth() === now.getMonth() && adjDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Stock Adjustments' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Stock Adjustments
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Record and track inventory adjustments
          </p>
        </div>
        {canEdit && (
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Adjustment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Adjustments</p>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Increases</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  +{stats.increases}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Decreases</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  -{stats.decreases}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">This Month</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.thisMonth}
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
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="increase">Increase</SelectItem>
                <SelectItem value="decrease">Decrease</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Adjustments Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Adjustment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAdjustments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No adjustments found</p>
              {canEdit && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setDialogOpen(true)}
                >
                  Record Your First Adjustment
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdjustments.map((adj) => (
                    <TableRow key={adj.id}>
                      <TableCell className="text-sm">
                        {format(new Date(adj.date), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium">{adj.productName}</TableCell>
                      <TableCell>
                        {adj.adjustmentType === 'increase' ? (
                          <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <ArrowUpCircle className="w-3 h-3" />
                            Increase
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <ArrowDownCircle className="w-3 h-3" />
                            Decrease
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        <span className={adj.adjustmentType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                          {adj.adjustmentType === 'increase' ? '+' : '-'}{adj.quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{adj.reason}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{adj.performedBy}</TableCell>
                      <TableCell className="text-sm text-slate-500 max-w-xs truncate">
                        {adj.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Adjustment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Stock Adjustment</DialogTitle>
            <DialogDescription>
              Adjust inventory quantities for corrections and updates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="product">Product *</Label>
                <Input
                  id="product"
                  placeholder="Search and select product..."
                  value={formData.productName || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    productName: e.target.value,
                    productId: `PROD${Date.now()}`
                  })}
                />
                <p className="text-xs text-slate-500 mt-1">
                  In production, this would be a searchable dropdown
                </p>
              </div>

              <div>
                <Label htmlFor="type">Adjustment Type *</Label>
                <Select 
                  value={formData.adjustmentType} 
                  onValueChange={(value: 'increase' | 'decrease') => 
                    setFormData({ ...formData, adjustmentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase Stock</SelectItem>
                    <SelectItem value="decrease">Decrease Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="reason">Reason *</Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(value: AdjustmentReason) => 
                    setFormData({ ...formData, reason: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Damage">Damage</SelectItem>
                    <SelectItem value="Loss">Loss/Theft</SelectItem>
                    <SelectItem value="Found">Found</SelectItem>
                    <SelectItem value="Recount">Recount</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  value={formData.reference || ''}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Optional reference number"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this adjustment..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDialogOpen(false);
              setFormData({ adjustmentType: 'increase', reason: 'Recount' });
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdjustment}>
              Record Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
