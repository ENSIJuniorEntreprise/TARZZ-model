const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Client = require('../models/Client');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildMeta, parseSort, toRegex } = require('../utils/query');

const listOrders = async query => {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, { date: 'date', amount: 'totalAmount' }, { date: -1 });

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.client) {
    if (!mongoose.Types.ObjectId.isValid(query.client)) throw new ApiError(400, 'Invalid client id');
    filter.client = query.client;
  }

  if (query.search) {
    const regex = toRegex(query.search);
    const matchedClients = await Client.find({
      $or: [{ firstName: regex }, { lastName: regex }, { phone: regex }],
    }).select('_id');

    filter.client = { $in: matchedClients.map(c => c._id) };
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .populate('client', 'firstName lastName phone address')
      .populate('products.product', 'name reference sellingPrice image')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return { data: items, meta: buildMeta(total, page, limit) };
};

const buildOrderLines = async items => {
  const orderLines = [];
  const decremented = [];

  try {
    for (const item of items) {
      const productId = item.product;
      const quantity = Number(item.quantity);

      if (!mongoose.Types.ObjectId.isValid(productId) || quantity <= 0) {
        throw new ApiError(400, 'Invalid product payload in order');
      }

      const product = await Product.findById(productId);
      if (!product) throw new ApiError(404, `Product not found: ${productId}`);

      if (product.stockQuantity < quantity) {
        throw new ApiError(400, `Insufficient stock for product ${product.reference}`);
      }

      const stockUpdate = await Product.updateOne(
        { _id: product._id, stockQuantity: { $gte: quantity } },
        { $inc: { stockQuantity: -quantity } }
      );

      if (stockUpdate.modifiedCount !== 1) {
        throw new ApiError(409, `Concurrent stock update detected for product ${product.reference}`);
      }

      decremented.push({ productId: product._id, quantity });

      const unitPrice = product.sellingPrice;
      const lineTotal = unitPrice * quantity;

      orderLines.push({
        product: product._id,
        quantity,
        unitPrice,
        lineTotal,
      });
    }

    return orderLines;
  } catch (error) {
    await Promise.all(
      decremented.map(entry =>
        Product.updateOne({ _id: entry.productId }, { $inc: { stockQuantity: entry.quantity } })
      )
    );
    throw error;
  }
};

const createOrder = async payload => {
  if (!mongoose.Types.ObjectId.isValid(payload.client)) {
    throw new ApiError(400, 'Invalid client id');
  }

  const client = await Client.findById(payload.client);
  if (!client) throw new ApiError(404, 'Client not found');

  const items = Array.isArray(payload.products) ? payload.products : [];
  if (items.length === 0) throw new ApiError(400, 'Order must contain at least one product');

  const orderLines = await buildOrderLines(items);

  const totalItems = orderLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = orderLines.reduce((sum, line) => sum + line.lineTotal, 0);

  const order = await Order.create({
    client: client._id,
    date: payload.date ? new Date(payload.date) : new Date(),
    products: orderLines,
    totalItems,
    totalAmount,
    status: payload.status || 'pending',
  });

  return Order.findById(order._id)
    .populate('client', 'firstName lastName phone address')
    .populate('products.product', 'name reference sellingPrice image');
};

const updateOrderStatus = async (id, status) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid order id');

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
    .populate('client', 'firstName lastName phone address')
    .populate('products.product', 'name reference sellingPrice image');

  if (!order) throw new ApiError(404, 'Order not found');
  return order;
};

module.exports = {
  listOrders,
  createOrder,
  updateOrderStatus,
};
