/* ================================
   INVENTORY MODULE
================================ */

/**
 * Check paper availability
 * @param {number} quantity - sheets needed
 * @param {number} available - sheets in stock
 * @returns {{ok: boolean, remaining: number}}
 */
function checkPaperInventory(quantity, available) {
  if (quantity <= 0) {
    return { ok: true, remaining: available };
  }

  const remaining = available - quantity;

  return {
    ok: remaining >= 0,
    remaining: remaining
  };
}


/**
 * Calculate ink usage for a job
 * @param {number} usagePerPage - ml per page
 * @param {number} quantity - pages printed
 * @returns {number}
 */
function calculateInkUsage(usagePerPage, quantity) {
  if (usagePerPage <= 0 || quantity <= 0) return 0;
  return usagePerPage * quantity;
}


/**
 * Check ink inventory for one color
 * @param {number} usagePerPage - ml per page
 * @param {number} quantity - pages
 * @param {number} stock - ml available
 * @returns {{ok: boolean, used: number, remaining: number}}
 */
function checkInkInventory(usagePerPage, quantity, stock) {
  const used = calculateInkUsage(usagePerPage, quantity);
  const remaining = stock - used;

  return {
    ok: remaining >= 0,
    used: used,
    remaining: remaining
  };
}


/**
 * Check full CMYK inventory
 * @param {Object} usage - per page usage {c,m,y,k}
 * @param {Object} stock - current stock {c,m,y,k}
 * @param {number} quantity
 * @returns {{
 *  ok: boolean,
 *  details: {
 *    c: {used, remaining, ok},
 *    m: {used, remaining, ok},
 *    y: {used, remaining, ok},
 *    k: {used, remaining, ok}
 *  }
 * }}
 */
function checkCMYKInventory(usage, stock, quantity) {
  const c = checkInkInventory(usage.c, quantity, stock.c);
  const m = checkInkInventory(usage.m, quantity, stock.m);
  const y = checkInkInventory(usage.y, quantity, stock.y);
  const k = checkInkInventory(usage.k, quantity, stock.k);

  return {
    ok: c.ok && m.ok && y.ok && k.ok,
    details: { c, m, y, k }
  };
}


/**
 * Deduct inventory after successful job
 * (call this only if inventory is OK)
 */
function deductInventory(current, used) {
  return {
    c: current.c - used.c,
    m: current.m - used.m,
    y: current.y - used.y,
    k: current.k - used.k
  };
}