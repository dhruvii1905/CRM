const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const tenderSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  title: { type: String, required: true },
  portal: { type: String, enum: ['GeM', 'CPPP', 'State', 'Private', 'Other'], default: 'Other' },
  referenceNo: String,
  client: { type: String, ref: 'Customer' },
  value: Number,
  deadline: Date,
  submissionDate: Date,
  status: { type: String, enum: ['identified', 'applied', 'won', 'lost', 'cancelled'], default: 'identified' },
  notes: String,
  assignedTo: { type: String, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Tender', tenderSchema);
