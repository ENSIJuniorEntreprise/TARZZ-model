const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildMeta, parseSort, toRegex } = require('../utils/query');

const listCategories = async query => {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, { name: 'name', date: 'createdAt' }, { name: 1 });

  const filter = {};
  if (query.search) {
    filter.name = toRegex(query.search);
  }

  const [items, total] = await Promise.all([
    Category.find(filter).sort(sort).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);

  return { data: items, meta: buildMeta(total, page, limit) };
};

const createCategory = async payload => {
  const name = String(payload.name).trim();
  const exists = await Category.findOne({ name: toRegex(`^${name}$`) });
  if (exists) throw new ApiError(409, 'Category already exists');
  return Category.create({ name });
};

const updateCategory = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid category id');

  const name = String(payload.name).trim();
  const duplicate = await Category.findOne({ _id: { $ne: id }, name: toRegex(`^${name}$`) });
  if (duplicate) throw new ApiError(409, 'Category already exists');

  const category = await Category.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};

const deleteCategory = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid category id');

  const linkedProducts = await Product.countDocuments({ category: id });
  if (linkedProducts > 0) {
    throw new ApiError(409, 'Category cannot be deleted because products are linked to it');
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, 'Category not found');
};

const getOrCreateCategory = async ({ categoryId, categoryName }) => {
  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }

  if (categoryName) {
    const normalized = String(categoryName).trim();
    const existing = await Category.findOne({ name: toRegex(`^${normalized}$`) });
    if (existing) return existing;
    return Category.create({ name: normalized });
  }

  throw new ApiError(400, 'Category is required');
};

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrCreateCategory,
};
