import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '@/app/types';
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
import { Separator } from '@/app/components/ui/separator';
import {
  Search,
  Plus,
  Eye,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  Download,
  Send
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AccessDenied } from '@/app/components/AccessDenied';

export const InvoicingPage: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Admin-only access control
  if (user?.role !== 'Admin') {
    return <AccessDenied />;
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleStatusUpdate = (invoiceId: string, newStatus: InvoiceStatus) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...inv, 
            status: newStatus,
            paidDate: newStatus === 'Paid' ? new Date().toISOString() : inv.paidDate
          }
        : inv
    ));
    toast.success(`Invoice status updated to ${newStatus}`);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const variants = {
      Draft: { variant: 'secondary' as const, icon: FileText },
      Sent: { variant: 'default' as const, icon: Send },
      Paid: { variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
      Overdue: { variant: 'destructive' as const, icon: AlertCircle },
      Cancelled: { variant: 'secondary' as const, icon: XCircle },
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
    total: invoices.length,
    sent: invoices.filter(inv => inv.status === 'Sent').length,
    paid: invoices.filter(inv => inv.status === 'Paid').length,
    overdue: invoices.filter(inv => inv.status === 'Overdue').length,
    totalRevenue: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0),
    pending: invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.total, 0),
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Invoices' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Invoices
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage customer invoices and payments
          </p>
        </div>
        {canEdit && (
          <Button className="gap-2" onClick={() => toast.info('Create invoice feature coming soon')}>
            <Plus className="w-4 h-4" />
            New Invoice
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
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Invoices</p>
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
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Paid</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  ${stats.totalRevenue.toFixed(0)}
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
                  ${stats.pending.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Overdue</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.overdue}
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
                placeholder="Search by invoice number or customer..."
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
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Invoices List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No invoices found</p>
              {canEdit && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => toast.info('Create invoice feature coming soon')}
                >
                  Create Your First Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-semibold">${invoice.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('Download PDF feature coming soon')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
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

      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Invoice Details
              </span>
              {selectedInvoice && getStatusBadge(selectedInvoice.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
                  <p className="font-medium">{selectedInvoice.customerName}</p>
                  {selectedInvoice.customerId && (
                    <p className="text-sm text-slate-500">Customer ID: {selectedInvoice.customerId}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Issue Date:</span>
                    <span className="font-medium">{format(new Date(selectedInvoice.issueDate), 'MMM dd, yyyy')}</span>
                    <span className="text-slate-500">Due Date:</span>
                    <span className="font-medium">{format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}</span>
                    {selectedInvoice.paidDate && (
                      <>
                        <span className="text-slate-500">Paid Date:</span>
                        <span className="font-medium text-green-600">
                          {format(new Date(selectedInvoice.paidDate), 'MMM dd, yyyy')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Items Table */}
              <div>
                <h3 className="font-semibold text-sm mb-3">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.tax.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-medium">${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax:</span>
                    <span className="font-medium">${selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.paymentMethod && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    <span className="text-slate-500">Payment Method: </span>
                    <span className="font-medium">{selectedInvoice.paymentMethod}</span>
                  </p>
                </div>
              )}

              {selectedInvoice.notes && (
                <div>
                  <Label className="text-xs text-slate-500">Notes</Label>
                  <p className="text-sm mt-1">{selectedInvoice.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              {canEdit && selectedInvoice.status !== 'Paid' && selectedInvoice.status !== 'Cancelled' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      handleStatusUpdate(selectedInvoice.id, 'Sent');
                      setViewDialogOpen(false);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Mark as Sent
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleStatusUpdate(selectedInvoice.id, 'Paid');
                      setViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => toast.info('Download PDF feature coming soon')}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
