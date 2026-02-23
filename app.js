/* ================================
   DOM ELEMENT REFERENCES
================================ */

// Print details
const quantityInput = document.getElementById('quantity');

// Paper
const paperCostInput = document.getElementById('paperCost');
const paperStock = document.getElementById('paperStock');

// CMYK cost
const cCost = document.getElementById('cCost');
const mCost = document.getElementById('mCost');
const yCost = document.getElementById('yCost');
const kCost = document.getElementById('kCost');

// CMYK usage
const cUsage = document.getElementById('cUsage');
const mUsage = document.getElementById('mUsage');
const yUsage = document.getElementById('yUsage');
const kUsage = document.getElementById('kUsage');

// Ink stock
const cStock = document.getElementById('cStock');
const mStock = document.getElementById('mStock');
const yStock = document.getElementById('yStock');
const kStock = document.getElementById('kStock');

// Electricity
const printerWatt = document.getElementById('printerWatt');
const kwhRate = document.getElementById('kwhRate');
const timePerPage = document.getElementById('timePerPage');
const totalHoursEl = document.getElementById('totalHours');

// Product & profit
const laborCost = document.getElementById('laborCost');
const profitMargin = document.getElementById('profitMargin');
const profitAmountEl = document.getElementById('profitAmount');
const sellingPriceEl = document.getElementById('sellingPrice');

// Totals & warnings
const totalCostEl = document.getElementById('totalCost');
const inventoryWarning = document.getElementById('inventoryWarning');

// Receipt
const jobRefEl = document.getElementById('jobRef');
const jobDateEl = document.getElementById('jobDate');

const rQty = document.getElementById('rQty');
const rPaper = document.getElementById('rPaper');
const rInk = document.getElementById('rInk');
const rElectricity = document.getElementById('rElectricity');
const rLabor = document.getElementById('rLabor');
const rBase = document.getElementById('rBase');
const rProfit = document.getElementById('rProfit');
const rTotal = document.getElementById('rTotal');

const printBtn = document.getElementById('printBtn');


/* ================================
   HELPERS
================================ */

function formatPeso(amount) {
  return '₱ ' + (amount || 0).toFixed(2);
}

function generateJobRef() {
  return 'JOB-' + Date.now().toString().slice(-6);
}


/* ================================
   MAIN CALCULATION
================================ */

function updateTotal() {
  inventoryWarning.textContent = '';

  const quantity = parseFloat(quantityInput.value) || 0;
  const paperCost = parseFloat(paperCostInput.value) || 0;
  const paperAvailable = parseFloat(paperStock.value) || 0;
  const labor = parseFloat(laborCost.value) || 0;
  const margin = parseFloat(profitMargin.value) || 0;

  /* PAPER COST */
  const paperTotal = calculatePaperCost(quantity, paperCost);
  if (quantity > paperAvailable && quantity > 0) {
    inventoryWarning.textContent += '⚠ Not enough paper stock.\n';
  }

  /* INK INVENTORY CHECK */
  const cUsed = calculateInventoryUsage(parseFloat(cUsage.value) || 0, quantity);
  const mUsed = calculateInventoryUsage(parseFloat(mUsage.value) || 0, quantity);
  const yUsed = calculateInventoryUsage(parseFloat(yUsage.value) || 0, quantity);
  const kUsed = calculateInventoryUsage(parseFloat(kUsage.value) || 0, quantity);

  if (cUsed > (parseFloat(cStock.value) || 0)) inventoryWarning.textContent += '⚠ Cyan ink low.\n';
  if (mUsed > (parseFloat(mStock.value) || 0)) inventoryWarning.textContent += '⚠ Magenta ink low.\n';
  if (yUsed > (parseFloat(yStock.value) || 0)) inventoryWarning.textContent += '⚠ Yellow ink low.\n';
  if (kUsed > (parseFloat(kStock.value) || 0)) inventoryWarning.textContent += '⚠ Black ink low.\n';

  /* INK COST */
  const inkTotal = calculateInkCost(
    parseFloat(cCost.value) || 0,
    parseFloat(mCost.value) || 0,
    parseFloat(yCost.value) || 0,
    parseFloat(kCost.value) || 0,
    parseFloat(cUsage.value) || 0,
    parseFloat(mUsage.value) || 0,
    parseFloat(yUsage.value) || 0,
    parseFloat(kUsage.value) || 0,
    quantity
  );

  /* ELECTRICITY */
  const elecData = calculateElectricityCost(
    parseFloat(printerWatt.value) || 0,
    parseFloat(kwhRate.value) || 0,
    parseFloat(timePerPage.value) || 0,
    quantity
  );

  totalHoursEl.value = elecData.hours ? elecData.hours.toFixed(2) : '0.00';

  /* BASE COST */
  const baseCost =
    paperTotal +
    inkTotal +
    (elecData.cost || 0) +
    labor;

  /* PROFIT */
  const profit = baseCost * (margin / 100);
  const sellingPrice = baseCost + profit;

  /* UI OUTPUT */
  totalCostEl.textContent = formatPeso(baseCost);
  profitAmountEl.value = formatPeso(profit);
  sellingPriceEl.value = formatPeso(sellingPrice);

  /* RECEIPT */
  jobRefEl.textContent = jobRefEl.textContent || generateJobRef();
  jobDateEl.textContent = new Date().toLocaleDateString();

  rQty.textContent = quantity;
  rPaper.textContent = formatPeso(paperTotal);
  rInk.textContent = formatPeso(inkTotal);
  rElectricity.textContent = formatPeso(elecData.cost || 0);
  rLabor.textContent = formatPeso(labor);
  rBase.textContent = formatPeso(baseCost);
  rProfit.textContent = formatPeso(profit);
  rTotal.textContent = formatPeso(sellingPrice);
}


/* ================================
   EVENTS
================================ */

[
  quantityInput,
  paperCostInput,
  paperStock,
  cCost, mCost, yCost, kCost,
  cUsage, mUsage, yUsage, kUsage,
  cStock, mStock, yStock, kStock,
  printerWatt, kwhRate, timePerPage,
  laborCost, profitMargin
].forEach(input => {
  if (input) input.addEventListener('input', updateTotal);
});

if (printBtn) {
  printBtn.addEventListener('click', () => window.print());
}