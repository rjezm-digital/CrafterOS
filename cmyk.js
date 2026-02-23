/* ================================
   CMYK COSTING MODULE
================================ */

/**
 * Calculate ink cost per page
 * @param {number} cCost - Cyan cost per ml
 * @param {number} mCost - Magenta cost per ml
 * @param {number} yCost - Yellow cost per ml
 * @param {number} kCost - Black cost per ml
 * @param {number} cUsage - Cyan usage per page (ml)
 * @param {number} mUsage - Magenta usage per page (ml)
 * @param {number} yUsage - Yellow usage per page (ml)
 * @param {number} kUsage - Black usage per page (ml)
 * @returns {number} ink cost per page
 */
function calculateInkCostPerPage(
  cCost,
  mCost,
  yCost,
  kCost,
  cUsage,
  mUsage,
  yUsage,
  kUsage
) {
  return (
    (cCost * cUsage) +
    (mCost * mUsage) +
    (yCost * yUsage) +
    (kCost * kUsage)
  );
}

/**
 * Calculate total ink cost for a job
 * @param {number} cCost
 * @param {number} mCost
 * @param {number} yCost
 * @param {number} kCost
 * @param {number} cUsage
 * @param {number} mUsage
 * @param {number} yUsage
 * @param {number} kUsage
 * @param {number} quantity
 * @returns {number} total ink cost
 */
function calculateInkCost(
  cCost,
  mCost,
  yCost,
  kCost,
  cUsage,
  mUsage,
  yUsage,
  kUsage,
  quantity
) {
  if (quantity <= 0) return 0;

  const perPage = calculateInkCostPerPage(
    cCost,
    mCost,
    yCost,
    kCost,
    cUsage,
    mUsage,
    yUsage,
    kUsage
  );

  return perPage * quantity;
}

/**
 * Calculate ink usage for inventory deduction
 * @param {number} usagePerPage
 * @param {number} quantity
 * @returns {number} total ink used
 */
function calculateInventoryUsage(usagePerPage, quantity) {
  if (usagePerPage <= 0 || quantity <= 0) return 0;
  return usagePerPage * quantity;
}