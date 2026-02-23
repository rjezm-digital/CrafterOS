/* ================================
   SAFE DOM HELPER
================================ */
function el(id) {
  return document.getElementById(id);
}

/* ================================
   DOM REFERENCES
================================ */

// Calculator inputs
const quantityInput = el('quantity');
const paperCostInput = el('paperCost');
const paperStock = el('paperStock');

const laborCost = el('laborCost');
const profitMargin = el('profitMargin');

// CMYK
const cCost = el('cCost');
const mCost = el('mCost');
const yCost = el('yCost');
const kCost = el('kCost');

const cUsage = el('cUsage');
const mUsage = el('mUsage');
const yUsage = el('yUsage');
const kUsage = el('kUsage');

const cStock = el('cStock');
const mStock = el('mStock');
const yStock = el('yStock');
const kStock = el('kStock');

// Electricity
const printerWatt = el('printerWatt');
const kwhRate = el('kwhRate');
const timePerPage = el('timePerPage');
const totalHoursEl = el('totalHours');

// Output
const totalCostEl = el('totalCost');
const profitAmountEl = el('profitAmount');
const sellingPriceEl = el('sellingPrice');
const inventoryWarning = el('inventoryWarning');

// Receipt
const jobRefEl = el('jobRef');
const jobDateEl = el('jobDate');
const rQty = el('rQty');
const rPaper = el('rPaper');
const rInk = el('rInk');
const rElectricity = el('rElectricity');
const rLabor = el('rLabor');
const rBase = el('rBase');
const rProfit = el('rProfit');
const rTotal = el('rTotal');
const printBtn = el('printBtn');

/* ================================
   COSTING PRESETS (TAB)
================================ */

const presetPaperCost = el('presetPaperCost');
const presetLaborCost = el('presetLaborCost');
const presetProfitMargin = el('presetProfitMargin');
const presetKwhRate = el('presetKwhRate');

const applyCostingBtn = el('applyCostingBtn');
const saveCostingBtn = el('saveCostingBtn');

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
  if (!quantityInput || !paperCostInput) return;

  if (inventoryWarning) inventoryWarning.textContent = '';

  const quantity = Number(quantityInput.value) || 0;
  const paperCost = Number(paperCostInput.value) || 0;
  const paperAvailable = Number(paperStock?.value) || 0;
  const labor = Number(laborCost?.value) || 0;
  const margin = Number(profitMargin?.value) || 0;

  // Paper
  const paperTotal = calculatePaperCost(quantity, paperCost);
  if (quantity > paperAvailable && quantity > 0 && inventoryWarning) {
    inventoryWarning.textContent += '⚠ Not enough paper stock\n';
  }

  // Ink usage check
  const cUsed = calculateInventoryUsage(Number(cUsage?.value) || 0, quantity);
  const mUsed = calculateInventoryUsage(Number(mUsage?.value) || 0, quantity);
  const yUsed = calculateInventoryUsage(Number(yUsage?.value) || 0, quantity);
  const kUsed = calculateInventoryUsage(Number(kUsage?.value) || 0, quantity);

  if (cUsed > Number(cStock?.value || 0)) inventoryWarning.textContent += '⚠ Cyan ink low\n';
  if (mUsed > Number(mStock?.value || 0)) inventoryWarning.textContent += '⚠ Magenta ink low\n';
  if (yUsed > Number(yStock?.value || 0)) inventoryWarning.textContent += '⚠ Yellow ink low\n';
  if (kUsed > Number(kStock?.value || 0)) inventoryWarning.textContent += '⚠ Black ink low\n';

  // Ink cost
  const inkTotal = calculateInkCost(
    Number(cCost?.value) || 0,
    Number(mCost?.value) || 0,
    Number(yCost?.value) || 0,
    Number(kCost?.value) || 0,
    Number(cUsage?.value) || 0,
    Number(mUsage?.value) || 0,
    Number(yUsage?.value) || 0,
    Number(kUsage?.value) || 0,
    quantity
  );

  // Electricity
  const elec = calculateElectricityCost(
    Number(printerWatt?.value) || 0,
    Number(kwhRate?.value) || 0,
    Number(timePerPage?.value) || 0,
    quantity
  );

  if (totalHoursEl) totalHoursEl.value = elec.hours.toFixed(2);

  // Totals
  const baseCost = paperTotal + inkTotal + elec.cost + labor;
  const profit = baseCost * (margin / 100);
  const sellingPrice = baseCost + profit;

  // UI
  if (totalCostEl) totalCostEl.textContent = formatPeso(baseCost);
  if (profitAmountEl) profitAmountEl.value = formatPeso(profit);
  if (sellingPriceEl) sellingPriceEl.value = formatPeso(sellingPrice);

  // Receipt
  if (jobRefEl) jobRefEl.textContent ||= generateJobRef();
  if (jobDateEl) jobDateEl.textContent = new Date().toLocaleDateString();

  if (rQty) rQty.textContent = quantity;
  if (rPaper) rPaper.textContent = formatPeso(paperTotal);
  if (rInk) rInk.textContent = formatPeso(inkTotal);
  if (rElectricity) rElectricity.textContent = formatPeso(elec.cost);
  if (rLabor) rLabor.textContent = formatPeso(labor);
  if (rBase) rBase.textContent = formatPeso(baseCost);
  if (rProfit) rProfit.textContent = formatPeso(profit);
  if (rTotal) rTotal.textContent = formatPeso(sellingPrice);
}

/* ================================
   COSTING PRESET LOGIC
================================ */

function applyCostingToCalculator() {
  if (presetPaperCost && paperCostInput) paperCostInput.value = presetPaperCost.value;
  if (presetLaborCost && laborCost) laborCost.value = presetLaborCost.value;
  if (presetProfitMargin && profitMargin) profitMargin.value = presetProfitMargin.value;
  if (presetKwhRate && kwhRate) kwhRate.value = presetKwhRate.value;
  updateTotal();
}

function saveCostingDefaults() {
  const data = {
    paperCost: presetPaperCost?.value || 0,
    laborCost: presetLaborCost?.value || 0,
    profitMargin: presetProfitMargin?.value || 0,
    kwhRate: presetKwhRate?.value || 0
  };
  localStorage.setItem('costingDefaults', JSON.stringify(data));
}

function loadCostingDefaults() {
  const saved = localStorage.getItem('costingDefaults');
  if (!saved) return;
  const d = JSON.parse(saved);
  if (presetPaperCost) presetPaperCost.value = d.paperCost;
  if (presetLaborCost) presetLaborCost.value = d.laborCost;
  if (presetProfitMargin) presetProfitMargin.value = d.profitMargin;
  if (presetKwhRate) presetKwhRate.value = d.kwhRate;
}

/* ================================
   EVENTS
================================ */

function bind(input) {
  if (input) input.addEventListener('input', updateTotal);
}

[
  quantityInput,
  paperCostInput,
  paperStock,
  laborCost,
  profitMargin,
  cCost, mCost, yCost, kCost,
  cUsage, mUsage, yUsage, kUsage,
  cStock, mStock, yStock, kStock,
  printerWatt, kwhRate, timePerPage
].forEach(bind);

if (applyCostingBtn) applyCostingBtn.addEventListener('click', applyCostingToCalculator);
if (saveCostingBtn) saveCostingBtn.addEventListener('click', saveCostingDefaults);
if (printBtn) printBtn.addEventListener('click', () => window.print());

loadCostingDefaults();

/* ================================
   TAB NAVIGATION
================================ */

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.querySelector(`.tab-panel[data-panel="${tab.dataset.tab}"]`);
    if (panel) panel.classList.add('active');

    if (tab.dataset.tab === 'calculator') updateTotal();
  });
});