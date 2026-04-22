const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order.service');

const getOrders = catchAsync(async (req, res) => {
  const result = await orderService.listOrders(req.query);
  res.status(200).json({ success: true, ...result });
});

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, data: order });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: order });
});

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
