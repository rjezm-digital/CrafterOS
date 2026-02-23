/* ================================
   ELECTRICITY COSTING MODULE
================================ */

/**
 * Calculate electricity usage and cost
 * @param {number} wattage - Printer wattage (W)
 * @param {number} rate - Cost per kWh (₱)
 * @param {number} secondsPerPage - Print time per page (seconds)
 * @param {number} quantity - Number of pages
 * @returns {{hours: number, cost: number}}
 */
function calculateElectricityCost(
  wattage,
  rate,
  secondsPerPage,
  quantity
) {
  if (
    wattage <= 0 ||
    rate <= 0 ||
    secondsPerPage <= 0 ||
    quantity <= 0
  ) {
    return { hours: 0, cost: 0 };
  }

  // Convert seconds to hours
  const totalHours = (secondsPerPage * quantity) / 3600;

  // Electricity cost formula
  const cost = (wattage / 1000) * totalHours * rate;

  return {
    hours: totalHours,
    cost: cost
  };
}