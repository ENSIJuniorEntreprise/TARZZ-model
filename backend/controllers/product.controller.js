const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildMeta } = require('../utils/query');

const getProducts = catchAsync(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name parent').sort({ name: 1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, data: products, meta: buildMeta(total, page, limit) });
});

const createProduct = catchAsync(async (req, res) => {
  const { name, category, stock } = req.body;
  if (!name || !name.trim()) throw new ApiError(400, 'name is required');
  if (!mongoose.Types.ObjectId.isValid(category)) throw new ApiError(400, 'Invalid category id');
  const cat = await Category.findById(category);
  if (!cat) throw new ApiError(404, 'Category not found');
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const product = await Product.create({
    name: name.trim(),
    category,
    imageUrl,
    stock: stock !== undefined ? Math.max(0, parseInt(stock) || 0) : 20,
  });
  await product.populate('category', 'name parent');
  res.status(201).json({ success: true, data: product });
});

const updateProduct = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid product id');
  const update = {};
  if (req.body.name     !== undefined) update.name     = String(req.body.name).trim();
  if (req.body.category !== undefined) update.category = req.body.category;
  if (req.body.stock    !== undefined) update.stock    = Math.max(0, parseInt(req.body.stock) || 0);
  if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    .populate('category', 'name parent');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: product });
});

const deleteProduct = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid product id');
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: null });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
