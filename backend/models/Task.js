const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const taskSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignedTo: { type: String, ref: 'User' },
  relatedTo: { type: String },
  relatedModel: { type: String, enum: ['Customer', 'Lead'] }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
