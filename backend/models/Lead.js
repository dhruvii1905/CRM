const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  source: { type: String, enum: ['web', 'referral', 'social', 'other'], default: 'other' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost'], default: 'new' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
