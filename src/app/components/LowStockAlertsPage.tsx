import React, { useState } from 'react';
import { LowStockAlert, AlertPriority, AlertStatus } from '@/app/types';
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
import {
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Package,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { mockLowStockAlerts } from '@/app/data/mockData';
import { AccessDenied } from '@/app/components/AccessDenied';

export const LowStockAlertsPage: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<LowStockAlert[]>(mockLowStockAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AlertStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | AlertPriority>('all');
  const [selectedAlert, setSelectedAlert] = useState<LowStockAlert | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Admin-only access control
  if (user?.role !== 'Admin') {
    return <AccessDenied />;
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAcknowledge = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            status: 'Acknowledged' as AlertStatus,
            acknowledgedAt: new Date().toISOString(),
            acknowledgedBy: user?.name || 'Unknown'
          }
        : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            status: 'Resolved' as AlertStatus,
            resolvedAt: new Date().toISOString()
          }
        : alert
    ));
    toast.success('Alert resolved');
  };

  const handleCreatePO = (alert: LowStockAlert) => {
    toast.info(`Create PO for ${alert.productName} - Qty: ${alert.reorderQuantity}`);
    setViewDialogOpen(false);
  };

  const getPriorityBadge = (priority: AlertPriority) => {
    const variants = {
      Low: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
      Medium: { variant: 'default' as const, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
      High: { variant: 'default' as const, className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' },
      Critical: { variant: 'destructive' as const, className: '' },
    };

    const config = variants[priority];

    return (
      <Badge variant={config.variant} className={config.className}>
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: AlertStatus) => {
    const variants = {
      Active: { variant: 'destructive' as const, icon: AlertCircle },
      Acknowledged: { variant: 'default' as const, icon: AlertTriangle, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' },
      Resolved: { variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
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
    total: alerts.length,
    active: alerts.filter(a => a.status === 'Active').length,
    critical: alerts.filter(a => a.priority === 'Critical').length,
    acknowledged: alerts.filter(a => a.status === 'Acknowledged').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Low Stock Alerts' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            Low Stock Alerts
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Monitor and manage inventory alerts
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => toast.info('Refreshing alerts...')}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Alerts
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Alerts</p>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Active</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Critical</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.critical}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Acknowledged</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.acknowledged}
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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No low stock alerts</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                All products are above minimum stock levels
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Reorder Qty</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.productName}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-red-600">{alert.currentStock}</span>
                      </TableCell>
                      <TableCell>{alert.minStockLevel}</TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {alert.reorderQuantity}
                      </TableCell>
                      <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(alert.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAlert(alert);
                              setViewDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                          {canEdit && alert.status === 'Active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              Acknowledge
                            </Button>
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

      {/* View Alert Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alert Details
            </DialogTitle>
            <DialogDescription>
              Low stock alert for {selectedAlert?.productName}
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Product</p>
                  <p className="font-medium">{selectedAlert.productName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedAlert.status)}</div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Current Stock</p>
                  <p className="font-semibold text-2xl text-red-600">{selectedAlert.currentStock}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Minimum Level</p>
                  <p className="font-semibold text-2xl">{selectedAlert.minStockLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Recommended Reorder</p>
                  <p className="font-semibold text-2xl text-blue-600">{selectedAlert.reorderQuantity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Priority</p>
                  <div className="mt-1">{getPriorityBadge(selectedAlert.priority)}</div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>Stock Shortage:</strong> {selectedAlert.minStockLevel - selectedAlert.currentStock} units below minimum level
                </p>
              </div>

              {selectedAlert.acknowledgedAt && (
                <div className="text-sm">
                  <p className="text-slate-500 dark:text-slate-400">
                    Acknowledged by {selectedAlert.acknowledgedBy} on{' '}
                    {format(new Date(selectedAlert.acknowledgedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}

              {canEdit && (
                <div className="flex gap-2 pt-4 border-t">
                  {selectedAlert.status === 'Active' && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        handleAcknowledge(selectedAlert.id);
                        setViewDialogOpen(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    onClick={() => handleCreatePO(selectedAlert)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Purchase Order
                  </Button>
                  {selectedAlert.status !== 'Resolved' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleResolve(selectedAlert.id);
                        setViewDialogOpen(false);
                      }}
                    >
                      Resolve
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
    </div>
  );
};
