# DB Migration & Seed

Apply the initial migration and seed to a Postgres database.

Prerequisites:
- Postgres 12+ with `pgcrypto` extension available.

Quick apply (example):

```bash
# run migration
psql -h <host> -U <user> -d <db> -f "db/migrations/001_init.sql"

# run seed
psql -h <host> -U <user> -d <db> -f "db/seed/seed_basic.sql"
```

Notes:
- The migration creates a `current_tenant()` helper that reads `myapp.tenant_id` session setting.
- To run queries as a specific tenant (so RLS allows access), set the session variable:

```sql
SET SESSION myapp.tenant_id = 'your-tenant-uuid';
```

- The application should set `myapp.tenant_id` for each DB connection (or `SET LOCAL` per transaction).
- Seed uses simple selection of tenant by name; in production prefer deterministic UUIDs or separate scripts that capture returned ids.

Sectors (tenant-scoped domains):
- The second migration `db/migrations/002_sectors.sql` adds `tenant_sectors` and `sector_features`.
- Use `tenant_sectors` to model multiple sectors/locations within a tenant (warehouse, retail outlet, medical ward).
- `sector_features` allows enabling/disabling features per sector; application should evaluate sector-level flags first, then tenant-level, then global defaults.

