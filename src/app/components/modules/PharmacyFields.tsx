import React from 'react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import DateInput from '@/app/components/ui/DateInput';
import { Product } from '@/app/types';

interface Props {
  formData: Partial<Product>;
  setFormData: (d: Partial<Product>) => void;
  disabled?: boolean;
}

const PharmacyFields: React.FC<Props> = ({ formData, setFormData, disabled }) => {
  return (
    <div className="space-y-3 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
      <h4 className="font-semibold">Pharmacy Details</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Medicine Name</Label>
          <Input value={formData.medicineName || formData.name || ''} onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label>Batch Number</Label>
          <Input value={formData.batchNumber || ''} onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <DateInput label="Expiry Date" value={formData.expiryDate || ''} onChange={(e: any) => setFormData({ ...formData, expiryDate: e.target.value })} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <DateInput label="Manufacturing Date" value={formData.manufacturingDate || ''} onChange={(e: any) => setFormData({ ...formData, manufacturingDate: e.target.value })} disabled={disabled} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Manufacturer</Label>
          <Input value={formData.manufacturer || ''} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label>Prescription Required</Label>
          <div>
            <Checkbox checked={!!formData.prescriptionRequired} onCheckedChange={(v) => setFormData({ ...formData, prescriptionRequired: !!v })} disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyFields;
