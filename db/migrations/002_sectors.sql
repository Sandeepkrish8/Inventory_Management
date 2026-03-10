-- Add tenant sectors (domains within a tenant) and per-sector feature overrides

CREATE TABLE tenant_sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sector_code text NOT NULL,
  name text NOT NULL,
  admin_user_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, sector_code)
);

CREATE INDEX idx_tenant_sectors_tenant ON tenant_sectors(tenant_id);

-- Features applied specifically to a tenant sector (e.g., medical ward enabling expiry_tracking)
CREATE TABLE sector_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sector_id uuid NOT NULL REFERENCES tenant_sectors(id) ON DELETE CASCADE,
  feature_key text NOT NULL REFERENCES features(feature_key) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  enabled_from timestamptz,
  enabled_until timestamptz,
  UNIQUE (tenant_id, sector_id, feature_key)
);

-- Enable RLS for new tables
ALTER TABLE tenant_sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_sector_isolation ON tenant_sectors USING (tenant_id = current_tenant()) WITH CHECK (tenant_id = current_tenant());

ALTER TABLE sector_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY sector_features_isolation ON sector_features USING (tenant_id = current_tenant()) WITH CHECK (tenant_id = current_tenant());
