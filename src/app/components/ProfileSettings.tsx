import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Lock,
  Eye,
  Camera,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Inventory Manager with 5+ years of experience',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    orderUpdates: true,
    weeklyReports: false,
  });

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      bio: 'Inventory Manager with 5+ years of experience',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Profile & Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </span>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              {isEditing && (
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{user?.name}</h3>
              <Badge variant="outline" className="mt-1">
                <Shield className="w-3 h-3 mr-1" />
                {user?.role}
              </Badge>
              <p className="text-sm text-slate-500 mt-2">
                {isEditing ? 'Click the camera icon to upload new photo' : 'JPG or PNG, max size 2MB'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="disabled:opacity-70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 disabled:opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 disabled:opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 disabled:opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Push Notifications</p>
              <p className="text-sm text-slate-500">Receive push notifications in browser</p>
            </div>
            <Switch
              checked={notificationSettings.pushNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Low Stock Alerts</p>
              <p className="text-sm text-slate-500">Get notified when products are low in stock</p>
            </div>
            <Switch
              checked={notificationSettings.lowStockAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Order Updates</p>
              <p className="text-sm text-slate-500">Notifications for order status changes</p>
            </div>
            <Switch
              checked={notificationSettings.orderUpdates}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, orderUpdates: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Weekly Reports</p>
              <p className="text-sm text-slate-500">Receive weekly summary reports</p>
            </div>
            <Switch
              checked={notificationSettings.weeklyReports}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Change Password</p>
              <p className="text-sm text-slate-500">Update your password regularly</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Active Sessions</p>
              <p className="text-sm text-slate-500">Manage your active sessions</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
