-- Initial schema for multi-tenant SaaS inventory system
-- Postgres SQL - creates core tables, indexes and RLS function/policies

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper to obtain current tenant from session
CREATE OR REPLACE FUNCTION current_tenant() RETURNS uuid AS $$
  SELECT CASE WHEN current_setting('myapp.tenant_id', true) IS NULL THEN NULL
              ELSE current_setting('myapp.tenant_id', true)::uuid END;
$$ LANGUAGE sql STABLE;

-- TENANTS
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain_code text,
  plan_key text,
  timezone text,
  status text DEFAULT 'active',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_tenants_domain ON tenants(domain_code);

-- USERS (tenant-scoped)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL,
  hashed_password text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);
CREATE UNIQUE INDEX ux_users_tenant_email ON users(tenant_id, lower(email));

-- GLOBAL LOOKUPS: domains, plans, features, feature_packs
CREATE TABLE domains (
  code text PRIMARY KEY,
  name text NOT NULL,
  description text
);

CREATE TABLE plans (
  plan_key text PRIMARY KEY,
  name text NOT NULL,
  price_month_cents bigint DEFAULT 0,
  price_year_cents bigint DEFAULT 0,
  limits jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE features (
  feature_key text PRIMARY KEY,
  description text,
  default_enabled boolean DEFAULT false
);

CREATE TABLE feature_packs (
  pack_key text PRIMARY KEY,
  name text,
  description text
);

CREATE TABLE pack_features (
  pack_key text NOT NULL REFERENCES feature_packs(pack_key) ON DELETE CASCADE,
  feature_key text NOT NULL REFERENCES features(feature_key) ON DELETE CASCADE,
  PRIMARY KEY(pack_key, feature_key)
);

-- CORE MULTI-TENANT TABLES (tenant_id on each row)
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sku text NOT NULL,
  name text NOT NULL,
  brand text,
  tax_code text,
  default_uom text,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX ux_products_tenant_sku ON products(tenant_id, sku);
CREATE INDEX idx_products_tenant_created ON products(tenant_id, created_at);

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  attributes jsonb DEFAULT '{}'::jsonb,
  sku text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_variants_tenant_sku ON product_variants(tenant_id, sku);

CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  supplier text,
  reference text,
  total_amount_cents bigint,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE purchase_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  product_id uuid,
  variant_id uuid,
  qty numeric,
  unit_price_cents bigint
);

CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer text,
  reference text,
  total_amount_cents bigint,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE sales_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_id uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  product_id uuid,
  variant_id uuid,
  qty numeric,
  unit_price_cents bigint
);

-- Stock transactions (immutable ledger)
CREATE TABLE stock_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  variant_id uuid,
  qty numeric NOT NULL,
  from_location uuid,
  to_location uuid,
  txn_type text NOT NULL,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_stock_txn_tenant_product ON stock_transactions(tenant_id, product_id, created_at);

-- Denormalized current balance per product/variant/warehouse
CREATE TABLE stock_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  variant_id uuid,
  warehouse_id uuid,
  qty_on_hand numeric DEFAULT 0,
  qty_reserved numeric DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE (tenant_id, product_id, variant_id, warehouse_id)
);
CREATE INDEX idx_stock_balances_tenant_wh ON stock_balances(tenant_id, warehouse_id);

-- Tenant feature overrides
CREATE TABLE tenant_features (
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_key text NOT NULL REFERENCES features(feature_key) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  enabled_from timestamptz,
  enabled_until timestamptz,
  PRIMARY KEY (tenant_id, feature_key)
);

CREATE TABLE tenant_feature_packs (
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  pack_key text NOT NULL REFERENCES feature_packs(pack_key) ON DELETE CASCADE,
  applied_at timestamptz DEFAULT now(),
  PRIMARY KEY (tenant_id, pack_key)
);

-- Subscriptions & billing
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_key text NOT NULL,
  status text NOT NULL,
  started_at timestamptz DEFAULT now(),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  billing_cycle text,
  payment_provider_ref text,
  metadata jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  subscription_id uuid,
  amount_cents bigint,
  status text,
  due_date timestamptz,
  issued_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  invoice_id uuid,
  provider text,
  provider_payment_id text,
  amount_cents bigint,
  status text,
  created_at timestamptz DEFAULT now(),
  raw_payload jsonb
);

-- Audit logs (tenant-scoped)
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  entity text,
  entity_id uuid,
  action text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS & policies for tenant-scoped tables
DO $$
DECLARE
  t text;
  tenant_tables text[] := ARRAY[
    'users','products','product_variants','purchases','purchase_lines','sales','sales_lines',
    'stock_transactions','stock_balances','tenant_features','tenant_feature_packs',
    'subscriptions','invoices','payments','audit_logs'
  ];
BEGIN
  FOREACH t IN ARRAY tenant_tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = current_tenant()) WITH CHECK (tenant_id = current_tenant());', t);
  END LOOP;
END$$;

-- Useful indexes
CREATE INDEX idx_stock_txn_tenant_created ON stock_transactions(tenant_id, created_at);
CREATE INDEX idx_audit_tenant_created ON audit_logs(tenant_id, created_at);

-- NOTES:
-- - Use SET LOCAL myapp.tenant_id = '<uuid>' within transaction/session to enforce RLS.
-- - Application should also include tenant_id in INSERT payloads (RLS WITH CHECK will verify).
