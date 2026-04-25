const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildMeta, parseSort, toRegex } = require('../utils/query');
const { getOrCreateCategory } = require('./category.service');

const listProducts = async query => {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(
    query,
    { date: 'createdAt', stock: 'stockQuantity', price: 'sellingPrice', name: 'name' },
    { createdAt: -1 }
  );

  const filter = {};
  if (query.category) {
    if (!mongoose.Types.ObjectId.isValid(query.category)) throw new ApiError(400, 'Invalid category id');
    filter.category = query.category;
  }

  if (query.search) {
    const searchRegex = toRegex(query.search);
    filter.$or = [{ name: searchRegex }, { reference: searchRegex }];
  }

  if (query.lowStock === 'true') {
    const threshold = Number(query.lowStockThreshold) || 3;
    filter.stockQuantity = { $lte: threshold };
  }

  if (query.stock === 'in') {
    filter.stockQuantity = { $gt: 0 };
  }

  if (query.stock === 'out') {
    filter.stockQuantity = 0;
  }

  if (query.stock === 'low') {
    filter.stockQuantity = { $gt: 0, $lte: 3 };
  }

  const [items, total] = await Promise.all([
    Product.find(filter).populate('category', 'name').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return { data: items, meta: buildMeta(total, page, limit) };
};

const createProduct = async (payload, file) => {
  const category = await getOrCreateCategory({
    categoryId: payload.category,
    categoryName: payload.categoryName,
  });

  const product = await Product.create({
    name: String(payload.name).trim(),
    reference: String(payload.reference).trim().toUpperCase(),
    description: payload.description ? String(payload.description).trim() : '',
    purchasePrice: Number(payload.purchasePrice),
    sellingPrice: Number(payload.sellingPrice),
    stockQuantity: Number(payload.stockQuantity),
    category: category._id,
    image: file ? `/uploads/${file.filename}` : null,
  });

  return Product.findById(product._id).populate('category', 'name');
};

const updateProduct = async (id, payload, file) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid product id');

  const existing = await Product.findById(id);
  if (!existing) throw new ApiError(404, 'Product not found');

  let categoryId = existing.category;
  if (payload.category || payload.categoryName) {
    const category = await getOrCreateCategory({
      categoryId: payload.category,
      categoryName: payload.categoryName,
    });
    categoryId = category._id;
  }

  const update = {
    name: payload.name !== undefined ? String(payload.name).trim() : existing.name,
    reference:
      payload.reference !== undefined
        ? String(payload.reference).trim().toUpperCase()
        : existing.reference,
    description:
      payload.description !== undefined
        ? String(payload.description).trim()
        : existing.description,
    purchasePrice:
      payload.purchasePrice !== undefined ? Number(payload.purchasePrice) : existing.purchasePrice,
    sellingPrice:
      payload.sellingPrice !== undefined ? Number(payload.sellingPrice) : existing.sellingPrice,
    stockQuantity:
      payload.stockQuantity !== undefined ? Number(payload.stockQuantity) : existing.stockQuantity,
    category: categoryId,
    image: file ? `/uploads/${file.filename}` : existing.image,
  };

  const updated = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate(
    'category',
    'name'
  );

  return updated;
};

const deleteProduct = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid product id');

  const linkedOrders = await Order.countDocuments({ 'products.product': id });
  if (linkedOrders > 0) {
    throw new ApiError(409, 'Product cannot be deleted because it is already used in orders');
  }

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, 'Product not found');
};

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
