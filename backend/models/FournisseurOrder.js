const mongoose = require('mongoose');

const fournisseurOrderSchema = new mongoose.Schema(
  {
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fournisseur',
      required: true,
      index: true,
    },
    items: [
      {
        productName:     { type: String, required: true, trim: true, maxlength: 200 },
        productCategory: { type: String, default: '', trim: true, maxlength: 200 },
        quantity:        { type: Number, default: 1, min: 1 },
      },
    ],
    date:     { type: Date, default: Date.now },
    status:   { type: String, enum: ['en_attente', 'confirme', 'recu'], default: 'en_attente' },
    remarque: { type: String, default: '', trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FournisseurOrder', fournisseurOrderSchema);
