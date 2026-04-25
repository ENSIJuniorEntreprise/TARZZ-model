const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ClientOrder = require('../models/ClientOrder');
const Client = require('../models/Client');
const ApiError = require('../utils/ApiError');

const VALID_STATUSES = ['en_commande', 'en_cours', 'livre'];

const getClientOrders = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    throw new ApiError(400, 'Invalid client id');

  const orders = await ClientOrder.find({ client: req.params.id }).sort({ date: -1 });
  res.json({ success: true, data: orders });
});

const createClientOrder = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    throw new ApiError(400, 'Invalid client id');

  const client = await Client.findById(req.params.id);
  if (!client) throw new ApiError(404, 'Client not found');

  const { productName, productCategory, date, status, remarque } = req.body;
  if (!productName?.trim()) throw new ApiError(400, 'productName is required');
  if (status && !VALID_STATUSES.includes(status))
    throw new ApiError(400, 'Invalid status');

  const order = await ClientOrder.create({
    client: req.params.id,
    productName: productName.trim(),
    productCategory: productCategory?.trim() || '',
    date: date ? new Date(date) : new Date(),
    status: status || 'en_commande',
    remarque: remarque?.trim() || '',
  });

  res.status(201).json({ success: true, data: order });
});

const updateClientOrder = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    throw new ApiError(400, 'Invalid order id');

  const { status, remarque } = req.body;
  const update = {};

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status');
    update.status = status;
  }
  if (remarque !== undefined) update.remarque = String(remarque).trim();

  const order = await ClientOrder.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true }
  );
  if (!order) throw new ApiError(404, 'Order not found');

  res.json({ success: true, data: order });
});

const deleteClientOrder = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    throw new ApiError(400, 'Invalid order id');

  const order = await ClientOrder.findByIdAndDelete(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  res.json({ success: true, data: null });
});

module.exports = { getClientOrders, createClientOrder, updateClientOrder, deleteClientOrder };
