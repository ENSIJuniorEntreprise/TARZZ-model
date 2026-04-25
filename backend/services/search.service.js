const Product = require('../models/Product');
const Client = require('../models/Client');
const Order = require('../models/Order');
const { toRegex } = require('../utils/query');

const globalSearch = async query => {
  const q = String(query || '').trim();
  if (!q) {
    return { products: [], clients: [], orders: [] };
  }

  const regex = toRegex(q);

  const [products, clients, orders] = await Promise.all([
    Product.find({ $or: [{ name: regex }, { reference: regex }] }).limit(5).select('name reference stockQuantity'),
    Client.find({ $or: [{ firstName: regex }, { lastName: regex }, { phone: regex }] })
      .limit(5)
      .select('firstName lastName phone'),
    Order.find({ status: regex })
      .limit(5)
      .populate('client', 'firstName lastName')
      .select('date status totalAmount'),
  ]);

  return { products, clients, orders };
};

module.exports = { globalSearch };
