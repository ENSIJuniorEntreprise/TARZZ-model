const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');

const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.listCategories(req.query);
  res.status(200).json({ success: true, ...result });
});

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({ success: true, data: category });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted' });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
