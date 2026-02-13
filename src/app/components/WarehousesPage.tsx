import React, { useState } from 'react';
import { Location } from '@/app/types';
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
  Warehouse,
  Building2,
  MapPin,
  Box,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { Textarea } from '@/app/components/ui/textarea';
import { mockLocations } from '@/app/data/mockData';
import { AccessDenied } from '@/app/components/AccessDenied';

export const WarehousesPage: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Location['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Full'>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Location>>({});

  // Admin-only access control
  if (user?.role !== 'Admin') {
    return <AccessDenied />;
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || loc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || loc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEditLocation = (location: Location) => {
    setFormData(location);
    setEditDialogOpen(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      setLocations(locations.filter(l => l.id !== locationId));
      toast.success('Location deleted successfully');
    }
  };

  const handleSaveLocation = () => {
    if (!formData.name || !formData.code || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.id) {
      setLocations(locations.map(l => l.id === formData.id ? { 
        ...formData as Location,
        lastModifiedAt: new Date().toISOString(),
        lastModifiedBy: user?.name
      } : l));
      toast.success('Location updated successfully');
    } else {
      const newLocation: Location = {
        ...formData as Location,
        id: `LOC${Date.now()}`,
        status: 'Active',
        currentStock: 0,
        createdAt: new Date().toISOString(),
        createdBy: user?.name
      };
      setLocations([...locations, newLocation]);
      toast.success('Location created successfully');
    }

    setEditDialogOpen(false);
    setFormData({});
  };

  const getTypeBadge = (type: Location['type']) => {
    const variants = {
      Warehouse: { variant: 'default' as const, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: Warehouse },
      Zone: { variant: 'secondary' as const, icon: MapPin },
      Aisle: { variant: 'outline' as const, icon: Box },
      Bin: { variant: 'outline' as const, className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Box },
    };

    const config = variants[type];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className || ''}`}>
        <Icon className="w-3 h-3" />
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: 'Active' | 'Inactive' | 'Full') => {
    const variants = {
      Active: { variant: 'default' as const, className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
      Inactive: { variant: 'secondary' as const },
      Full: { variant: 'destructive' as const },
    };

    const config = variants[status];

    return (
      <Badge variant={config.variant} className={config.className || ''}>
        {status}
      </Badge>
    );
  };

  const getCapacityIndicator = (current: number, max?: number) => {
    if (!max) return <span className="text-slate-500">-</span>;
    
    const percentage = (current / max) * 100;
    let color = 'text-green-600';
    if (percentage >= 90) color = 'text-red-600';
    else if (percentage >= 75) color = 'text-orange-600';
    else if (percentage >= 50) color = 'text-yellow-600';

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[100px]">
          <div 
            className={`h-full ${
              percentage >= 90 ? 'bg-red-500' :
              percentage >= 75 ? 'bg-orange-500' :
              percentage >= 50 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${color}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    );
  };

  const stats = {
    total: locations.length,
    warehouses: locations.filter(l => l.type === 'Warehouse').length,
    active: locations.filter(l => l.status === 'Active').length,
    full: locations.filter(l => l.status === 'Full').length,
  };

  const totalCapacity = locations.reduce((sum, l) => sum + (l.maxCapacity || 0), 0);
  const totalStock = locations.reduce((sum, l) => sum + l.currentStock, 0);
  const overallUtilization = totalCapacity > 0 ? ((totalStock / totalCapacity) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4 sm:space-y-6">
      <Breadcrumbs items={[{ label: 'Warehouses & Locations' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Warehouse className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Warehouses & Locations
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage storage locations and inventory distribution
          </p>
        </div>
        {canEdit && (
          <Button 
            className="gap-2" 
            onClick={() => {
              setFormData({ type: 'Warehouse', status: 'Active' });
              setEditDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Location
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Locations</p>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Warehouses</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.warehouses}
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
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Utilization</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {overallUtilization}%
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
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Full</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {stats.full}
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
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
                <SelectItem value="Zone">Zone</SelectItem>
                <SelectItem value="Aisle">Aisle</SelectItem>
                <SelectItem value="Bin">Bin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Storage Locations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No locations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((loc) => (
                    <TableRow key={loc.id}>
                      <TableCell className="font-mono text-sm">{loc.code}</TableCell>
                      <TableCell className="font-medium">{loc.name}</TableCell>
                      <TableCell>{getTypeBadge(loc.type)}</TableCell>
                      <TableCell className="text-sm">
                        {loc.parentLocationId 
                          ? locations.find(l => l.id === loc.parentLocationId)?.name || loc.parentLocationId
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-sm">{loc.currentStock.toLocaleString()}</TableCell>
                      <TableCell>
                        {getCapacityIndicator(loc.currentStock, loc.maxCapacity)}
                      </TableCell>
                      <TableCell>{getStatusBadge(loc.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLocation(loc);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canEdit && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditLocation(loc)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLocation(loc.id)}
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

      {/* View Location Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-blue-600" />
              Location Details
            </DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Location Code</p>
                  <p className="font-mono font-medium">{selectedLocation.code}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Name</p>
                  <p className="font-medium">{selectedLocation.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
                  <div className="mt-1">{getTypeBadge(selectedLocation.type)}</div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedLocation.status)}</div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Current Stock</p>
                  <p className="font-medium">{selectedLocation.currentStock.toLocaleString()} units</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Max Capacity</p>
                  <p className="font-medium">
                    {selectedLocation.maxCapacity ? `${selectedLocation.maxCapacity.toLocaleString()} units` : 'Unlimited'}
                  </p>
                </div>
                {selectedLocation.address && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Address</p>
                    <p className="font-medium">{selectedLocation.address}</p>
                  </div>
                )}
                {selectedLocation.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Description</p>
                    <p className="text-sm">{selectedLocation.description}</p>
                  </div>
                )}
                {selectedLocation.parentLocationId && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Parent Location</p>
                    <p className="font-medium">
                      {locations.find(l => l.id === selectedLocation.parentLocationId)?.name || selectedLocation.parentLocationId}
                    </p>
                  </div>
                )}
              </div>
              {selectedLocation.maxCapacity && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Capacity Utilization</p>
                  {getCapacityIndicator(selectedLocation.currentStock, selectedLocation.maxCapacity)}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedLocation.currentStock.toLocaleString()} of {selectedLocation.maxCapacity.toLocaleString()} units
                  </p>
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

      {/* Edit/Add Location Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            <DialogDescription>
              Fill in the location information below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Location Code *</Label>
                <Input
                  id="code"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., WH-001, A-01, BIN-A1"
                />
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Warehouse"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Location['type']) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Zone">Zone</SelectItem>
                    <SelectItem value="Aisle">Aisle</SelectItem>
                    <SelectItem value="Bin">Bin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parentLocationId">Parent Location</Label>
                <Select
                  value={formData.parentLocationId || 'none'}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    parentLocationId: value === 'none' ? undefined : value 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {locations
                      .filter(l => l.id !== formData.id)
                      .map(l => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name} ({l.code})
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxCapacity">Max Capacity (units)</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity || ''}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || undefined })}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={formData.currentStock || 0}
                  onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Physical address"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes about this location"
                  rows={3}
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
            <Button onClick={handleSaveLocation}>
              {formData.id ? 'Update' : 'Add'} Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
