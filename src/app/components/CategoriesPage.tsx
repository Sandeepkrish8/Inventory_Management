import React, { useState } from 'react';
import { mockCategories } from '@/app/data/mockData';
import { Category } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
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
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';

export const CategoriesPage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  const handleOpenDialog = (mode: 'add' | 'edit', category?: Category) => {
    setDialogMode(mode);
    if (category) {
      setSelectedCategory(category);
      setFormData(category);
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        description: '',
        productCount: 0,
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(null);
    setSelectedCategory(null);
    setFormData({});
  };

  const handleSave = () => {
    if (dialogMode === 'add') {
      const newCategory: Category = {
        ...formData as Category,
        id: String(categories.length + 1),
        createdAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
      toast.success('Category added successfully');
    } else if (dialogMode === 'edit' && selectedCategory) {
      setCategories(categories.map(c => 
        c.id === selectedCategory.id 
          ? { ...formData as Category, id: c.id }
          : c
      ));
      toast.success('Category updated successfully');
    }
    handleCloseDialog();
  };

  const handleDelete = (category: Category) => {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      setCategories(categories.filter(c => c.id !== category.id));
      toast.success('Category deleted successfully');
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';
  const canDelete = user?.role === 'Admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Categories</h2>
          <p className="text-slate-500 mt-1">Manage product categories</p>
        </div>
        {canEdit && (
          <Button onClick={() => handleOpenDialog('add')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FolderTree className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{category.description}</p>
              <div className="flex gap-2">
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog('edit', category)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New Category' : 'Edit Category'}
            </DialogTitle>
            <DialogDescription>
              Fill in the category information below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Electronics, Furniture"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {dialogMode === 'add' ? 'Add Category' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
