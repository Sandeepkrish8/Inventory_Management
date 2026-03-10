import React, { useState, useEffect } from 'react';
import { useTenant } from '@/app/contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Building2, Save, Globe, DollarSign, Camera, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const OrganizationSettings: React.FC = () => {
  const { currentTenant } = useTenant();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    address: '',
    currency: 'USD',
    timezone: 'UTC',
  });

  useEffect(() => {
    if (currentTenant) {
      setFormData({
        name: currentTenant.name || '',
        taxId: currentTenant.taxId || 'Not provided',
        address: currentTenant.address || 'Not provided',
        currency: currentTenant.currency || 'USD',
        timezone: currentTenant.timezone || 'UTC',
      });
    }
  }, [currentTenant]);

  const handleSave = () => {
    toast.success('Organization settings updated successfully!');
    setIsEditing(false);
  };

  if (!currentTenant) {
    return <div>No organization selected.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Organization Profile</h2>
        <p className="text-slate-500 mt-1">Manage your company details, branding, and regional settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Company Details
            </span>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            )}
          </CardTitle>
          <CardDescription>Basic information about your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center overflow-hidden">
                {currentTenant.logo ? (
                  <img src={currentTenant.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-white" />
                )}
              </div>
              {isEditing && (
                <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full shadow-md">
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Company Logo</h3>
              <p className="text-sm text-slate-500 mt-1">
                {isEditing ? 'Click the camera icon to upload a square logo' : 'JPG or PNG, max size 2MB'}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="disabled:opacity-70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / VAT Registration</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 disabled:opacity-70"
                  placeholder="e.g. GB123456789"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Registered Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className="disabled:opacity-70"
                placeholder="123 Business Rd, City, Country"
              />
            </div>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            Regional Settings
          </CardTitle>
          <CardDescription>Configure currency and timezone preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Base Currency</Label>
              <Select disabled={!isEditing} value={formData.currency} onValueChange={(val) => setFormData({ ...formData, currency: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select disabled={!isEditing} value={formData.timezone} onValueChange={(val) => setFormData({ ...formData, timezone: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
