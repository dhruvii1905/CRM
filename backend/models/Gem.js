const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  registrationNo: String,
  category: String,
  status: { type: String, enum: ['not-started', 'in-progress', 'registered', 'suspended', 'expired'], default: 'not-started' },
  registrationDate: Date,
  expiryDate: Date,
  portalUsername: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Gem', gemSchema);
