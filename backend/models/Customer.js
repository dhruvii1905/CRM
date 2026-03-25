const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const customerSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  company: String,
  status: { type: String, enum: ['active', 'inactive', 'prospect'], default: 'prospect' },
  assignedTo: { type: String, ref: 'User' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
