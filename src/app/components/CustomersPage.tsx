import React, { useState } from 'react';
import { Customer } from '@/app/types';
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
  Eye,
  Edit,
  Trash2,
  Filter,
  Users,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Mail,
  Phone,
  Building2,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AccessDenied } from '@/app/components/AccessDenied';

export const CustomersPage: React.FC = () => {
  const { user } = useAuth();
  
  // Block Viewer role from accessing this page
  if (user?.role === 'Viewer') {
    return <AccessDenied message="You don't have permission to access this page. This page is restricted to Staff and Admin users only." />;
  }
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setFormData(customer);
    setEditDialogOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
      toast.success('Customer deleted successfully');
    }
  };

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.id) {
      // Update existing
      setCustomers(customers.map(c => c.id === formData.id ? { ...formData as Customer } : c));
      toast.success('Customer updated successfully');
    } else {
      // Add new
      const newCustomer: Customer = {
        ...formData as Customer,
        id: `C${Date.now()}`,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        status: 'Active'
      };
      setCustomers([...customers, newCustomer]);
      toast.success('Customer added successfully');
    }

    setEditDialogOpen(false);
    setFormData({});
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Customers' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Customers
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage your customer database
          </p>
        </div>
        {canEdit && (
          <Button 
            className="gap-2" 
            onClick={() => {
              setFormData({});
              setEditDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Customers</p>
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
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  ${stats.totalRevenue.toFixed(0)}
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
                placeholder="Search by name, email, or company..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Customers List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No customers found</p>
              {canEdit && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setFormData({});
                    setEditDialogOpen(true);
                  }}
                >
                  Add Your First Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.company || '-'}</TableCell>
                      <TableCell className="text-sm">{customer.email}</TableCell>
                      <TableCell className="text-sm">{customer.phone}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell className="font-semibold">${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canEdit && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCustomer(customer)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCustomer(customer.id)}
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

      {/* View Customer Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Customer Details
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-500">Name</Label>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedCustomer.status === 'Active' ? 'default' : 'secondary'}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </Label>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </Label>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                {selectedCustomer.company && (
                  <div>
                    <Label className="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Company
                    </Label>
                    <p className="font-medium">{selectedCustomer.company}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </Label>
                  <p className="font-medium">{selectedCustomer.city}, {selectedCustomer.country}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-500">Address</Label>
                <p className="font-medium">{selectedCustomer.address}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                  <p className="text-xs text-slate-500">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toFixed(0)}</p>
                  <p className="text-xs text-slate-500">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{format(new Date(selectedCustomer.createdAt), 'MMM yyyy')}</p>
                  <p className="text-xs text-slate-500">Member Since</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Customer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              Fill in the customer information below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name (optional)"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              setFormData({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              {formData.id ? 'Update' : 'Add'} Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
