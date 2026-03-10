import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';

const DEFAULT_FEATURES = [
  'batch_tracking',
  'expiry_tracking',
  'serial_tracking',
  'variant_matrix',
  'multi_warehouse',
  'advanced_reporting',
  'approval_workflows',
];

const FEATURE_LABELS: Record<string, string> = {
  batch_tracking: 'Batch Tracking',
  expiry_tracking: 'Expiry Tracking',
  serial_tracking: 'Serial Number Tracking',
  variant_matrix: 'Variant Matrix',
  multi_warehouse: 'Multi Warehouse',
  advanced_reporting: 'Advanced Reporting',
  approval_workflows: 'Approval Workflows',
};

// LocalStorage keys used for demo-only admin UI
function sectorsKey(tenantName: string) {
  return `tenant_sectors::${tenantName}`;
}

function sectorFeaturesKey(tenantName: string) {
  return `sector_features::${tenantName}`;
}

export const SectorFeatureAdmin: React.FC = () => {
  const { user } = useAuth();
  const tenantName = localStorage.getItem('auth_tenant_name') || 'Acme Retail Pvt Ltd';

  const [sectors, setSectors] = useState<Array<{ code: string; name: string }>>([]);
  const [sectorFeatures, setSectorFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load sectors from localStorage or fallback defaults
    const raw = localStorage.getItem(sectorsKey(tenantName));
    if (raw) {
      try {
        setSectors(JSON.parse(raw));
      } catch (e) {
        setSectors([
          { code: 'warehouse', name: 'Main Warehouse' },
          { code: 'retail', name: 'Retail Store #1' },
          { code: 'returns', name: 'Returns Center' },
        ]);
      }
    } else {
      const defaults = [
        { code: 'warehouse', name: 'Main Warehouse' },
        { code: 'retail', name: 'Retail Store #1' },
        { code: 'returns', name: 'Returns Center' },
      ];
      setSectors(defaults);
      localStorage.setItem(sectorsKey(tenantName), JSON.stringify(defaults));
    }

    // Load sector features or initialize defaults
    const rawFeatures = localStorage.getItem(sectorFeaturesKey(tenantName));
    if (rawFeatures) {
      try {
        setSectorFeatures(JSON.parse(rawFeatures));
      } catch (e) {
        setSectorFeatures({});
      }
    } else {
      // initialize an object mapping sector_code -> feature_key -> enabled
      const initial: Record<string, Record<string, boolean>> = {};
      const initialSectors = raw ? JSON.parse(raw) : null;
      const seedSectors = initialSectors || [
        { code: 'warehouse' },
        { code: 'retail' },
        { code: 'returns' },
      ];
      seedSectors.forEach((s: any) => {
        initial[s.code] = {};
        DEFAULT_FEATURES.forEach((f) => {
          // default: enable multi_warehouse only for warehouse
          initial[s.code][f] = f === 'multi_warehouse' && s.code === 'warehouse';
        });
      });
      setSectorFeatures(initial);
      localStorage.setItem(sectorFeaturesKey(tenantName), JSON.stringify(initial));
    }
  }, [tenantName]);

  const toggleFeature = (sectorCode: string, featureKey: string) => {
    setSectorFeatures((prev) => {
      const copy = { ...prev };
      copy[sectorCode] = { ...(copy[sectorCode] || {}) };
      copy[sectorCode][featureKey] = !Boolean(copy[sectorCode][featureKey]);
      return copy;
    });
  };

  const save = () => {
    setSaving(true);
    // Simulate API save
    setTimeout(() => {
      localStorage.setItem(sectorFeaturesKey(tenantName), JSON.stringify(sectorFeatures));
      setSaving(false);
    }, 400);
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sector Feature Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted mb-4">Tenant: {tenantName} {user ? `- Admin: ${user.name}` : ''}</p>

          {sectors.map((s) => (
            <div key={s.code} className="mb-6">
              <h4 className="font-semibold mb-2">{s.name} <span className="text-xs text-slate-500">({s.code})</span></h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DEFAULT_FEATURES.map((f) => (
                  <div key={f} className="flex items-center justify-between border rounded px-3 py-2 bg-white">
                    <div>
                      <div className="font-medium">{FEATURE_LABELS[f] ?? f}</div>
                      <div className="text-xs text-slate-500">{f}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-xs">Enabled</Label>
                      <Switch
                        checked={Boolean(sectorFeatures[s.code] && sectorFeatures[s.code][f])}
                        onCheckedChange={() => toggleFeature(s.code, f)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
            <Button variant="ghost" onClick={() => { localStorage.removeItem(sectorFeaturesKey(tenantName)); window.location.reload(); }}>Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorFeatureAdmin;
