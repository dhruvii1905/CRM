const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const followupSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  title: { type: String, required: true },
  relatedTo: { type: String },
  relatedModel: { type: String, enum: ['Customer', 'Lead', 'Tender'] },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'done', 'overdue'], default: 'pending' },
  notes: String,
  assignedTo: { type: String, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Followup', followupSchema);
