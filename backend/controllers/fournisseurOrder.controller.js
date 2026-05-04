const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const FournisseurOrder = require('../models/FournisseurOrder');
const Fournisseur = require('../models/Fournisseur');
const ApiError = require('../utils/ApiError');

const VALID_STATUSES = ['en_attente', 'confirme', 'recu'];

const getFournisseurOrders = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid fournisseur id');
  const orders = await FournisseurOrder.find({ fournisseur: req.params.id }).sort({ date: -1 });
  res.json({ success: true, data: orders });
});

const createFournisseurOrder = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid fournisseur id');
  const f = await Fournisseur.findById(req.params.id);
  if (!f) throw new ApiError(404, 'Fournisseur not found');
  const { items, date, status, remarque } = req.body;
  if (!Array.isArray(items) || items.length === 0)
    throw new ApiError(400, 'items must be a non-empty array');
  if (status && !VALID_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status');
  const order = await FournisseurOrder.create({
    fournisseur: req.params.id,
    items: items.map(i => ({
      productName:     String(i.productName || '').trim(),
      productCategory: String(i.productCategory || '').trim(),
      quantity:        Math.max(1, parseInt(i.quantity) || 1),
    })),
    date:     date ? new Date(date) : new Date(),
    status:   status || 'en_attente',
    remarque: String(remarque || '').trim(),
  });
  res.status(201).json({ success: true, data: order });
});

const updateFournisseurOrder = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid order id');
  const { status, remarque } = req.body;
  const update = {};
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) throw new ApiError(400, 'Invalid status');
    update.status = status;
  }
  if (remarque !== undefined) update.remarque = String(remarque).trim();
  const order = await FournisseurOrder.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: order });
});

const deleteFournisseurOrder = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid order id');
  const order = await FournisseurOrder.findByIdAndDelete(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: null });
});

module.exports = { getFournisseurOrders, createFournisseurOrder, updateFournisseurOrder, deleteFournisseurOrder };
