import React from 'react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { useModule } from '@/app/contexts/ModuleContext';
import PharmacyFields from '@/app/components/modules/PharmacyFields';
import ManufacturingFields from '@/app/components/modules/ManufacturingFields';
import { Product } from '@/app/types';

interface Props {
  mode: 'add' | 'edit' | 'view' | null;
  formData: Partial<Product>;
  setFormData: (d: Partial<Product>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const ProductForm: React.FC<Props> = ({ mode, formData, setFormData, onCancel, onSubmit }) => {
  const { module } = useModule();
  const disabled = mode === 'view' || mode === null;

  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="col-span-2 space-y-2">
        <Label>Product Image</Label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800">
            {(formData.imageUrl) ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src={formData.imageUrl} alt="Product" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400" />
            )}
          </div>
          {!disabled && (
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
        <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU *</Label>
        <Input id="sku" value={formData.sku || ''} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode">Barcode</Label>
        <Input id="barcode" value={formData.barcode || ''} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} disabled={disabled} placeholder="e.g. 8901234567890" />
      </div>

      <div className="col-span-2 space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={disabled} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input id="category" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier *</Label>
        <Input id="supplier" value={formData.supplier || ''} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input id="quantity" type="number" value={String(formData.quantity ?? 0)} onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="minStockLevel">Min Stock Level *</Label>
        <Input id="minStockLevel" type="number" value={String(formData.minStockLevel ?? 0)} onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitPrice">Unit Price *</Label>
        <Input id="unitPrice" type="number" step="0.01" value={String(formData.unitPrice ?? 0)} onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })} disabled={disabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sellingPrice">Selling Price *</Label>
        <Input id="sellingPrice" type="number" step="0.01" value={String(formData.sellingPrice ?? 0)} onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })} disabled={disabled} />
      </div>

      {/* Module specific fields */}
      <div className="col-span-2">
        {module === 'pharmacy' && (
          <PharmacyFields formData={formData} setFormData={setFormData} disabled={disabled} />
        )}
        {module === 'manufacturing' && (
          <ManufacturingFields formData={formData} setFormData={setFormData} disabled={disabled} />
        )}
      </div>

      <div className="col-span-2 flex items-center justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>{disabled ? 'Close' : 'Cancel'}</Button>
        {!disabled && (
          <Button onClick={onSubmit}>{mode === 'add' ? 'Add Product' : 'Save Changes'}</Button>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
