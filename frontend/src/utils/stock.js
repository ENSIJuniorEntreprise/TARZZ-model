const STOCK_KEY = 'tarzz_stocks_v1';
export const DEFAULT_STOCK = 20;
export const LOW_STOCK_THRESHOLD = 5;

export const loadStocks = () => {
  try { return JSON.parse(localStorage.getItem(STOCK_KEY) || '{}'); }
  catch { return {}; }
};

const _persist = s => {
  localStorage.setItem(STOCK_KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent('tarzz-stock-changed'));
};

// "../../assets/KY1/sub/img.jpg" → "KY1/sub/img"
export const idToKey = id =>
  id.replace(/^.*\/assets\//, '').replace(/\.[^.]+$/, '');

// Get stock for a key — defaults to DEFAULT_STOCK if product unseen
export const getByKey = (key, stocks) => {
  const s = stocks || loadStocks();
  return key in s ? s[key] : DEFAULT_STOCK;
};

// Initialize any unseen product to DEFAULT_STOCK; returns updated stocks object
export function initStocks(allIds) {
  const s = loadStocks();
  let changed = false;
  for (const id of allIds) {
    const k = idToKey(id);
    if (!(k in s)) { s[k] = DEFAULT_STOCK; changed = true; }
  }
  if (changed) _persist(s);
  return loadStocks();
}

// Returns array of user-facing error strings (empty = all OK)
export function checkStocks(items) {
  const s = loadStocks();
  const errors = [];
  for (const { name, stockId, quantity } of items) {
    const current = getByKey(stockId, s);
    if (current < quantity) {
      errors.push(
        `${name} : ${current} disponible${current !== 1 ? 's' : ''} (demandé : ${quantity})`
      );
    }
  }
  return errors;
}

// Decrement stocks after order saved successfully
export function decrementStocks(items) {
  const s = loadStocks();
  for (const { stockId, quantity } of items) {
    s[stockId] = Math.max(0, getByKey(stockId, s) - quantity);
  }
  _persist(s);
}

// Restore stocks when an order is deleted
export function restoreStocks(items) {
  const s = loadStocks();
  for (const { stockId, quantity } of items) {
    if (!stockId) continue;
    s[stockId] = (stockId in s ? s[stockId] : 0) + (quantity || 1);
  }
  _persist(s);
}

// Direct manual update (from stock management page)
export function updateStock(key, value) {
  const s = loadStocks();
  s[key] = Math.max(0, value);
  _persist(s);
}

// For dashboard and alerts
export function getStockStats() {
  const s = loadStocks();
  const entries = Object.entries(s);
  const outOfStock = entries.filter(([, v]) => v === 0).length;
  const lowStock   = entries.filter(([, v]) => v > 0 && v <= LOW_STOCK_THRESHOLD).length;
  const lowStockItems = entries
    .filter(([, v]) => v <= LOW_STOCK_THRESHOLD)
    .map(([key, stock]) => {
      const parts   = key.split('/');
      const rawName = parts[parts.length - 1];
      const category = parts.slice(0, -1).join(' / ');
      return { key, name: rawName.replace(/[_-]/g, ' '), category, stock };
    })
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);
  return { outOfStock, lowStock, lowStockItems };
}
