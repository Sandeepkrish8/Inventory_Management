import React, { useState } from 'react';
import { mockProducts, mockOrders, mockTransactions } from '@/app/data/mockData';
import { Product } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { ColumnCustomizer, TableColumn } from '@/app/components/ColumnCustomizer';
import { LoadingSkeleton } from '@/app/components/LoadingSkeleton';
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
import { Checkbox } from '@/app/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/app/components/ui/sheet';
import { Progress } from '@/app/components/ui/progress';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Filter,
  LayoutGrid,
  List,
  Package,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';

export const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([
    { id: 'sku', label: 'SKU', visible: true },
    { id: 'name', label: 'Product Name', visible: true, pinned: true },
    { id: 'category', label: 'Category', visible: true },
    { id: 'quantity', label: 'Stock', visible: true },
    { id: 'price', label: 'Price', visible: true },
    { id: 'supplier', label: 'Supplier', visible: true },
    { id: 'status', label: 'Status', visible: true },
    { id: 'actions', label: 'Actions', visible: true, pinned: true },
  ]);

  const itemsPerPage = viewMode === 'grid' ? 12 : 10;

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    // Stock status filter
    let matchesStock = true;
    if (stockFilter === 'in-stock') {
      matchesStock = product.quantity > product.minStockLevel;
    } else if (stockFilter === 'low-stock') {
      matchesStock = product.quantity > 0 && product.quantity <= product.minStockLevel;
    } else if (stockFilter === 'out-of-stock') {
      matchesStock = product.quantity === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleOpenDialog = (mode: 'add' | 'edit' | 'view', product?: Product) => {
    setDialogMode(mode);
    if (product) {
      setSelectedProduct(product);
      setFormData(product);
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        sku: '',
        description: '',
        category: '',
        supplier: '',
        quantity: 0,
        minStockLevel: 0,
        unitPrice: 0,
        sellingPrice: 0,
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(null);
    setSelectedProduct(null);
    setFormData({});
  };

  const handleSave = () => {
    if (dialogMode === 'add') {
      const newProduct: Product = {
        ...formData as Product,
        id: String(products.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully');
    } else if (dialogMode === 'edit' && selectedProduct) {
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...formData as Product, id: p.id, updatedAt: new Date().toISOString() }
          : p
      ));
      toast.success('Product updated successfully');
    }
    handleCloseDialog();
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProducts(products.filter(p => p.id !== product.id));
      toast.success('Product deleted successfully');
    }
  };

  const isLowStock = (product: Product) => product.quantity <= product.minStockLevel;

  const getStockStatus = (product: Product): { label: string; className: string } => {
    if (product.quantity === 0) {
      return { label: 'Out of Stock', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' };
    } else if (product.quantity <= product.minStockLevel) {
      return { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200' };
    } else {
      return { label: 'In Stock', className: 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' };
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';
  const canDelete = user?.role === 'Admin';

  const handleExportCSV = () => {
    const rows = filteredProducts;
    const csv = [
      'SKU,Name,Category,Supplier,Quantity,Min Stock,Unit Price,Selling Price',
      ...rows.map(p => [p.sku, `"${p.name}"`, p.category, `"${p.supplier}"`, p.quantity, p.minStockLevel, p.unitPrice.toFixed(2), p.sellingPrice.toFixed(2)].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Products exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home' },
          { label: 'Products', icon: Package }
        ]}
      />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Products</h2>
          <p className="text-slate-500 mt-1">Manage your inventory products</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {canEdit && (
            <Button onClick={() => handleOpenDialog('add')} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="gap-1"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Table</span>
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="gap-1"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
              </div>
              {viewMode === 'table' && (
                <ColumnCustomizer 
                  columns={tableColumns}
                  onColumnsChange={setTableColumns}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selectedIds.size} product{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <Button size="sm" variant="outline" onClick={() => {
            const selected = filteredProducts.filter(p => selectedIds.has(p.id));
            const csv = ['SKU,Name,Category,Quantity,Unit Price', ...selected.map(p => [p.sku, `"${p.name}"`, p.category, p.quantity, p.unitPrice.toFixed(2)].join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'selected-products.csv'; a.click();
            URL.revokeObjectURL(url);
          }} className="gap-1">
            <Download className="w-3 h-3" />Export
          </Button>
          {(user?.role === 'Admin') && (
            <Button size="sm" variant="destructive" onClick={() => {
              if (confirm(`Delete ${selectedIds.size} products?`)) {
                setProducts(products.filter(p => !selectedIds.has(p.id)));
                setSelectedIds(new Set());
                toast.success(`${selectedIds.size} products deleted`);
              }
            }} className="gap-1">
              <Trash2 className="w-3 h-3" />Delete Selected
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Products Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.has(p.id))}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds(new Set([...selectedIds, ...paginatedProducts.map(p => p.id)]));
                        } else {
                          const newIds = new Set(selectedIds);
                          paginatedProducts.forEach(p => newIds.delete(p.id));
                          setSelectedIds(newIds);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Selling Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={(checked) => {
                          const newIds = new Set(selectedIds);
                          if (checked) newIds.add(product.id); else newIds.delete(product.id);
                          setSelectedIds(newIds);
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Badge className={getStockStatus(product).className}>
                          {getStockStatus(product).label}
                        </Badge>
                        <Badge variant="outline">
                          {product.quantity} units
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${product.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${product.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog('view', product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog('edit', product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    {product.imageUrl && (
                      <div className="w-full h-32 rounded-t-lg overflow-hidden bg-slate-100">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate" title={product.name}>
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-500">{product.sku}</p>
                        </div>
                        <Badge className={stockStatus.className + ' shrink-0'}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Category:</span>
                          <span className="font-medium">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Supplier:</span>
                          <span className="font-medium truncate ml-2" title={product.supplier}>
                            {product.supplier}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Stock:</span>
                          <Badge variant="outline">{product.quantity} units</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Unit Price:</span>
                          <span className="font-medium">${product.unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Selling Price:</span>
                          <span className="font-semibold text-green-600">
                            ${product.sellingPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog('view', product)}
                          className="flex-1 gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog('edit', product)}
                            className="flex-1 gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            className="px-2"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <div className="sm:hidden">
                  <span className="text-sm text-slate-600 px-2">
                    {currentPage} / {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' && 'Add New Product'}
              {dialogMode === 'edit' && 'Edit Product'}
              {dialogMode === 'view' && 'Product Details'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'view' 
                ? 'View product information' 
                : 'Fill in the product information below'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800">
                  {(formData.imageUrl) ? (
                    <img src={formData.imageUrl} alt="Product" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {dialogMode !== 'view' && (
                  <div className="space-y-1">
                    <Input
                      type="file"
                      accept="image/*"
                      className="max-w-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode || ''}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                disabled={dialogMode === 'view'}
                placeholder="e.g. 8901234567890"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={dialogMode === 'view'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input
                id="supplier"
                value={formData.supplier || ''}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity || 0}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Min Stock Level *</Label>
              <Input
                id="minStockLevel"
                type="number"
                value={formData.minStockLevel || 0}
                onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice || 0}
                onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                disabled={dialogMode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price *</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                value={formData.sellingPrice || 0}
                onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                disabled={dialogMode === 'view'}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              {dialogMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {dialogMode !== 'view' && (
              <Button onClick={handleSave}>
                {dialogMode === 'add' ? 'Add Product' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
