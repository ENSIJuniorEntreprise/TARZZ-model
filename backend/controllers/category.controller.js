const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const getCategories = catchAsync(async (req, res) => {
  const cats = await Category.find({}).populate('parent', 'name').sort({ name: 1 });
  res.json({ success: true, data: cats });
});

const createCategory = catchAsync(async (req, res) => {
  const { name, parent } = req.body;
  const cat = await Category.create({ name, parent: parent || null });
  await cat.populate('parent', 'name');
  res.status(201).json({ success: true, data: cat });
});

const updateCategory = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid id');
  const update = {};
  if (req.body.name  !== undefined) update.name   = req.body.name;
  if (req.body.parent !== undefined) update.parent = req.body.parent || null;
  const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    .populate('parent', 'name');
  if (!cat) throw new ApiError(404, 'Category not found');
  res.json({ success: true, data: cat });
});

const deleteCategory = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid id');
  const cat = await Category.findByIdAndDelete(req.params.id);
  if (!cat) throw new ApiError(404, 'Category not found');
  // Reparent children to null
  await Category.updateMany({ parent: req.params.id }, { parent: null });
  res.json({ success: true, data: null });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
