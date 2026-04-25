const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

const getProducts = catchAsync(async (req, res) => {
  const result = await productService.listProducts(req.query);
  res.status(200).json({ success: true, ...result });
});

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.file);
  res.status(201).json({ success: true, data: product });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.file);
  res.status(200).json({ success: true, data: product });
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json({ success: true, message: 'Product deleted' });
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
