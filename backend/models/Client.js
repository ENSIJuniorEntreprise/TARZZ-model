const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
  },
  { timestamps: true }
);

clientSchema.index({ firstName: 'text', lastName: 'text', phone: 'text' });

module.exports = mongoose.model('Client', clientSchema);
