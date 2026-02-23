/* ================================
   RECEIPT MODULE
================================ */

/**
 * Generate a unique job reference
 * @returns {string}
 */
function generateJobReference() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `JOB-${datePart}-${randomPart}`;
}

/**
 * Format date for receipt
 * @returns {string}
 */
function getReceiptDate() {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Build receipt data object
 * (useful for Firebase, PDF, history)
 */
function buildReceiptData({
  quantity,
  paperCost,
  inkCost,
  electricityCost,
  laborCost,
  baseCost,
  profit,
  total
}) {
  return {
    jobRef: generateJobReference(),
    date: getReceiptDate(),
    quantity,
    breakdown: {
      paper: paperCost,
      ink: inkCost,
      electricity: electricityCost,
      labor: laborCost
    },
    baseCost,
    profit,
    total
  };
}

/**
 * Render receipt values into UI
 */
function renderReceipt({
  jobRefEl,
  jobDateEl,
  rQty,
  rPaper,
  rInk,
  rElectricity,
  rLabor,
  rBase,
  rProfit,
  rTotal,
  data,
  formatCurrency
}) {
  jobRefEl.textContent = jobRefEl.textContent || data.jobRef;
  jobDateEl.textContent = data.date;

  rQty.textContent = data.quantity;
  rPaper.textContent = formatCurrency(data.breakdown.paper);
  rInk.textContent = formatCurrency(data.breakdown.ink);
  rElectricity.textContent = formatCurrency(data.breakdown.electricity);
  rLabor.textContent = formatCurrency(data.breakdown.labor);

  rBase.textContent = formatCurrency(data.baseCost);
  rProfit.textContent = formatCurrency(data.profit);
  rTotal.textContent = formatCurrency(data.total);
}

/**
 * Print / Save receipt as PDF
 */
function printReceipt() {
  window.print();
}