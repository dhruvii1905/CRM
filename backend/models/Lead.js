const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const leadSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  name: { type: String, required: true },
  email: String,
  phone: String,
  source: { type: String, enum: ['web', 'referral', 'social', 'other'], default: 'other' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost'], default: 'new' },
  assignedTo: { type: String, ref: 'User' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
