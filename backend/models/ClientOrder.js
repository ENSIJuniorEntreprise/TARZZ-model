const mongoose = require('mongoose');

const clientOrderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    productCategory: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['en_commande', 'en_cours', 'livre'],
      default: 'en_commande',
    },
    remarque: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClientOrder', clientOrderSchema);
