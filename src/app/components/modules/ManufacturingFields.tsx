import React from 'react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import DateInput from '@/app/components/ui/DateInput';
import { Product } from '@/app/types';

interface Props {
  formData: Partial<Product>;
  setFormData: (d: Partial<Product>) => void;
  disabled?: boolean;
}

const ManufacturingFields: React.FC<Props> = ({ formData, setFormData, disabled }) => {
  return (
    <div className="space-y-3 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
      <h4 className="font-semibold">Manufacturing Details</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Product Type</Label>
          <Select value={(formData.productType as string) || 'finished'} onValueChange={(v) => setFormData({ ...formData, productType: v })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raw">Raw Material</SelectItem>
              <SelectItem value="finished">Finished Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Warehouse Location</Label>
          <Input value={formData.warehouseLocation || ''} onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })} disabled={disabled} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Supplier</Label>
          <Input value={formData.supplier || ''} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label>Reorder Level</Label>
          <Input type="number" value={String(formData.reorderLevel ?? 0)} onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <DateInput label="Production Date" value={formData.productionDate || ''} onChange={(e: any) => setFormData({ ...formData, productionDate: e.target.value })} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default ManufacturingFields;
