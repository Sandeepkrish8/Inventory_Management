-- Basic seed data for initial setup

-- Domains
INSERT INTO domains(code, name, description) VALUES
  ('retail','Retail','Retail industry defaults'),
  ('medical','Medical','Medical/Pharma defaults')
ON CONFLICT (code) DO NOTHING;

-- Plans
INSERT INTO plans(plan_key, name, price_month_cents, price_year_cents, limits) VALUES
  ('basic','Basic',0,0,'{"users":5}'::jsonb),
  ('standard','Standard',2999,29999,'{"users":25}'::jsonb),
  ('pro','Pro',9999,99999,'{"users":100}'::jsonb)
ON CONFLICT (plan_key) DO NOTHING;

-- Features
INSERT INTO features(feature_key, description, default_enabled) VALUES
  ('batch_tracking','Track inventory batches', false),
  ('expiry_tracking','Expiry date tracking', false),
  ('serial_tracking','Serial number tracking', false),
  ('variant_matrix','Product variant matrix (size/color)', true),
  ('multi_warehouse','Multiple warehouses', true),
  ('advanced_reporting','Advanced reporting', false),
  ('approval_workflows','Approval workflows', false)
ON CONFLICT (feature_key) DO NOTHING;

-- Feature packs
INSERT INTO feature_packs(pack_key, name, description) VALUES
  ('retail_pack','Retail Pack','Default features for retail'),
  ('medical_pack','Medical Pack','Default features for medical')
ON CONFLICT (pack_key) DO NOTHING;

-- Pack features mapping (example)
INSERT INTO pack_features(pack_key, feature_key)
  VALUES
    ('retail_pack','variant_matrix'),
    ('retail_pack','multi_warehouse'),
    ('retail_pack','advanced_reporting'),
    ('medical_pack','expiry_tracking'),
    ('medical_pack','batch_tracking')
ON CONFLICT DO NOTHING;

-- Create a sample tenant and admin user
INSERT INTO tenants(id, name, domain_code, plan_key, status)
  VALUES (gen_random_uuid(), 'Acme Retail Pvt Ltd', 'retail', 'standard', 'active')
  RETURNING id INTO TEMP TABLE tmp_tenant_id;

-- Fallback if RETURNING into temp table unsupported in your psql, use SELECT
-- In many setups you can replace the previous block with a fixed UUID.

-- Attempt to reference tenant id
WITH t AS (SELECT id FROM tenants WHERE name = 'Acme Retail Pvt Ltd' LIMIT 1)
INSERT INTO users(id, tenant_id, email, role, is_active)
SELECT gen_random_uuid(), t.id, 'admin@acme.example', 'admin', true FROM t
ON CONFLICT DO NOTHING;

-- Apply feature pack to tenant
INSERT INTO tenant_feature_packs(tenant_id, pack_key)
SELECT t.id, 'retail_pack' FROM (SELECT id FROM tenants WHERE name='Acme Retail Pvt Ltd' LIMIT 1) t
ON CONFLICT DO NOTHING;

-- Create sectors for the tenant (warehouse, retail outlet, returns center)
WITH t AS (SELECT id FROM tenants WHERE name='Acme Retail Pvt Ltd' LIMIT 1)
INSERT INTO tenant_sectors(tenant_id, sector_code, name, admin_user_id)
SELECT t.id, s.code, s.name, NULL FROM t,
  (VALUES ('warehouse','Main Warehouse'), ('retail','Retail Store #1'), ('returns','Returns Center')) AS s(code, name)
ON CONFLICT DO NOTHING;

-- Example: enable multi_warehouse feature for warehouse sector only
WITH s AS (SELECT ts.id as sector_id, ts.tenant_id FROM tenant_sectors ts JOIN tenants t ON ts.tenant_id = t.id WHERE t.name='Acme Retail Pvt Ltd' AND ts.sector_code='warehouse' LIMIT 1)
INSERT INTO sector_features(tenant_id, sector_id, feature_key, enabled)
SELECT s.tenant_id, s.sector_id, 'multi_warehouse', true FROM s
ON CONFLICT DO NOTHING;

-- Create initial subscription row (trial)
INSERT INTO subscriptions(tenant_id, plan_key, status, started_at, trial_ends_at, current_period_end, billing_cycle)
SELECT t.id, 'standard', 'trialing', now(), now() + interval '14 days', now() + interval '31 days', 'monthly' FROM (SELECT id FROM tenants WHERE name='Acme Retail Pvt Ltd' LIMIT 1) t
ON CONFLICT DO NOTHING;

-- Note: Depending on your psql client, you may prefer to run these statements one by one and capture returned tenant id.
