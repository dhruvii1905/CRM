const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  portal: { type: String, enum: ['GeM', 'CPPP', 'State', 'Private', 'Other'], default: 'Other' },
  referenceNo: String,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  value: Number,
  deadline: Date,
  submissionDate: Date,
  status: { type: String, enum: ['identified', 'applied', 'won', 'lost', 'cancelled'], default: 'identified' },
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Tender', tenderSchema);
