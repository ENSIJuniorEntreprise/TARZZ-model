const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema(
  {
    prenom:  { type: String, required: true, trim: true, maxlength: 80 },
    nom:     { type: String, required: true, trim: true, maxlength: 80 },
    societe: { type: String, trim: true, default: '', maxlength: 150 },
    phone:   { type: String, trim: true, default: '', maxlength: 30 },
    email:   { type: String, trim: true, default: '', maxlength: 150 },
    adresse: { type: String, trim: true, default: '', maxlength: 300 },
  },
  { timestamps: true }
);

fournisseurSchema.index({ nom: 'text', prenom: 'text', societe: 'text' });

module.exports = mongoose.model('Fournisseur', fournisseurSchema);
