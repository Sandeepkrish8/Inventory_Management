import { parseISO, isBefore, addDays, differenceInCalendarDays } from 'date-fns';

export function getExpiringMedicines(products, withinDays = 30) {
  const now = new Date();
  return products.filter(p => p.expiryDate).filter(p => {
    try {
      const exp = parseISO(p.expiryDate);
      return isBefore(exp, addDays(now, withinDays)) && !isBefore(exp, now);
    } catch (e) {
      return false;
    }
  });
}

export function getExpiredMedicines(products) {
  const now = new Date();
  return products.filter(p => p.expiryDate).filter(p => {
    try {
      const exp = parseISO(p.expiryDate);
      return isBefore(exp, now);
    } catch (e) {
      return false;
    }
  });
}

export function groupBatches(products) {
  const map = new Map();
  products.forEach(p => {
    const batch = p.batchNumber || 'unknown';
    if (!map.has(batch)) map.set(batch, []);
    map.get(batch).push(p);
  });
  return map;
}

export function getRawMaterialStock(products) {
  return products.filter(p => p.productType === 'raw');
}

export function getProductionStatus(products) {
  const now = new Date();
  return products.map(p => {
    let status = 'Idle';
    if (p.productionDate) {
      try {
        const pd = parseISO(p.productionDate);
        const days = Math.abs(differenceInCalendarDays(now, pd));
        if (days <= 7) status = 'In Production';
        else status = 'Completed';
      } catch (e) {
        status = 'Unknown';
      }
    }
    return { product: p, status };
  });
}

export function getReorderAlerts(products) {
  return products.filter(p => typeof p.reorderLevel === 'number' && p.quantity <= p.reorderLevel);
}

export default {};
