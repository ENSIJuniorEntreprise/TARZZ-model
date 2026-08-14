const Product = require('../models/Product');
const Client = require('../models/Client');
const { toRegex } = require('../utils/query');

const globalSearch = async query => {
  const q = String(query || '').trim();
  if (!q) {
    return { products: [], clients: [], orders: [] };
  }

  const regex = toRegex(q);

  const [products, clients] = await Promise.all([
    Product.find({ $or: [{ name: regex }, { reference: regex }] }).limit(5).select('name reference stockQuantity'),
    Client.find({ $or: [{ firstName: regex }, { lastName: regex }, { phone: regex }] })
      .limit(5)
      .select('firstName lastName phone'),
  ]);

  return { products, clients, orders: [] };
};

module.exports = { globalSearch };
