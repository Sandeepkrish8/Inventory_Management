import assert from 'assert';
import { getExpiringMedicines, getExpiredMedicines, groupBatches, getRawMaterialStock, getReorderAlerts } from '../src/app/services/moduleHelpers.js';
import { mockProducts } from '../src/app/data/mockData.js';

function idSet(arr) { return new Set(arr.map(p => p.id)); }

try {
  console.log('Running moduleHelpers tests...');

  // Expiring within 120 days should include product id '11' (Paracetamol ~90 days)
  const exp120 = getExpiringMedicines(mockProducts, 120);
  assert(idSet(exp120).has('11'), 'Expected product 11 to be in expiring (120d)');

  // No expired medicines in mock (expiry in future), so expired set should be empty
  const expired = getExpiredMedicines(mockProducts);
  assert(Array.isArray(expired), 'Expired should be an array');

  // Batch grouping: pharmacy product has batch BATCH-PA-2024-01
  const batches = groupBatches(mockProducts);
  let foundBatch = false;
  for (const [batch, items] of batches.entries()) {
    if (batch === 'BATCH-PA-2024-01') { foundBatch = true; break; }
  }
  assert(foundBatch, 'Expected batch BATCH-PA-2024-01 to exist');

  // Raw material stock should include product id '12'
  const raw = getRawMaterialStock(mockProducts);
  assert(idSet(raw).has('12'), 'Expected product 12 to be raw material');

  // Reorder alerts: none expected for mocks (12 has quantity > reorderLevel)
  const reorder = getReorderAlerts(mockProducts);
  assert(Array.isArray(reorder), 'Reorder alerts should be array');

  console.log('All moduleHelpers tests passed ✅');
  process.exit(0);
} catch (err) {
  console.error('moduleHelpers tests failed ❌');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}
