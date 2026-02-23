function calculatePaperCost(quantity, paperCost) {
  if (quantity <= 0 || paperCost <= 0) return 0;
  return quantity * paperCost;
}

function calculateInkCost(c, m, y, k, cu, mu, yu, ku, qty) {
  const perPage =
    (c * cu) +
    (m * mu) +
    (y * yu) +
    (k * ku);

  return perPage * qty;
}

function calculateElectricityCost(watt, rate, secondsPerPage, qty) {
  if (watt <= 0 || rate <= 0 || secondsPerPage <= 0 || qty <= 0) return 0;

  const hours = (secondsPerPage * qty) / 3600;
  return {
    hours,
    cost: (watt / 1000) * hours * rate
  };
}

function calculateInventoryUsage(usagePerPage, qty) {
  return usagePerPage * qty;
}

