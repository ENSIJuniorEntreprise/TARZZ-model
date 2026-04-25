/**
 * db.js — Base de données JSON légère, persistée sur le disque.
 * Aucune dépendance native. Toutes les données sont stockées dans /data/*.json
 */
const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// ── Collection helper ─────────────────────────────────────────────────────────
function collection(name) {
  const file = path.join(DATA_DIR, `${name}.json`);

  function load() {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { return { records: [], seq: 0 }; }
  }

  function save(store) {
    fs.writeFileSync(file, JSON.stringify(store, null, 2));
  }

  return {
    all(filter) {
      const { records } = load();
      if (!filter) return records;
      return records.filter(filter);
    },
    get(id) {
      return load().records.find(r => r.id === Number(id)) || null;
    },
    insert(data) {
      const store = load();
      store.seq += 1;
      const record = { id: store.seq, created_at: new Date().toISOString(), ...data };
      store.records.unshift(record);
      save(store);
      return record;
    },
    update(id, data) {
      const store = load();
      const idx = store.records.findIndex(r => r.id === Number(id));
      if (idx === -1) return null;
      store.records[idx] = { ...store.records[idx], ...data };
      save(store);
      return store.records[idx];
    },
    delete(id) {
      const store = load();
      const before = store.records.length;
      store.records = store.records.filter(r => r.id !== Number(id));
      save(store);
      return store.records.length < before;
    },
    deleteWhere(filter) {
      const store = load();
      store.records = store.records.filter(r => !filter(r));
      save(store);
    },
  };
}

// ── Collections ───────────────────────────────────────────────────────────────
const users          = collection('users');
const categories     = collection('categories');
const subCategories  = collection('sub_categories');
const products       = collection('products');
const clients        = collection('clients');
const purchases      = collection('purchases');
const purchaseItems  = collection('purchase_items');

module.exports = { users, categories, subCategories, products, clients, purchases, purchaseItems };
