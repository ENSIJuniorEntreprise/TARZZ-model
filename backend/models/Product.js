const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: 200, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    imageUrl: { type: String, default: null },
    stock:    { type: Number, default: 20, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
