const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const Fournisseur = require('../models/Fournisseur');
const ApiError = require('../utils/ApiError');

const getFournisseurs = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.search) {
    const s = req.query.search;
    filter.$or = [
      { nom: new RegExp(s, 'i') },
      { prenom: new RegExp(s, 'i') },
      { societe: new RegExp(s, 'i') },
    ];
  }
  const list = await Fournisseur.find(filter).sort({ nom: 1 });
  res.json({ success: true, data: list });
});

const getFournisseur = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid id');
  const f = await Fournisseur.findById(req.params.id);
  if (!f) throw new ApiError(404, 'Fournisseur not found');
  res.json({ success: true, data: f });
});

const createFournisseur = catchAsync(async (req, res) => {
  const { prenom, nom, societe, phone, email, adresse } = req.body;
  const f = await Fournisseur.create({ prenom, nom, societe, phone, email, adresse });
  res.status(201).json({ success: true, data: f });
});

const updateFournisseur = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid id');
  const fields = ['prenom', 'nom', 'societe', 'phone', 'email', 'adresse'];
  const update = {};
  fields.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
  const f = await Fournisseur.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!f) throw new ApiError(404, 'Fournisseur not found');
  res.json({ success: true, data: f });
});

const deleteFournisseur = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Invalid id');
  const f = await Fournisseur.findByIdAndDelete(req.params.id);
  if (!f) throw new ApiError(404, 'Fournisseur not found');
  res.json({ success: true, data: null });
});

module.exports = { getFournisseurs, getFournisseur, createFournisseur, updateFournisseur, deleteFournisseur };
