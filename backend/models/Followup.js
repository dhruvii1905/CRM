const mongoose = require('mongoose');

const followupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  relatedTo: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedModel' },
  relatedModel: { type: String, enum: ['Customer', 'Lead', 'Tender'] },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'done', 'overdue'], default: 'pending' },
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Followup', followupSchema);
