const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const gemSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  client: { type: String, ref: 'Customer', required: true },
  registrationNo: String,
  category: String,
  status: { type: String, enum: ['not-started', 'in-progress', 'registered', 'suspended', 'expired'], default: 'not-started' },
  registrationDate: Date,
  expiryDate: Date,
  portalUsername: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Gem', gemSchema);
