const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const documentSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  name: { type: String, required: true },
  type: { type: String, enum: ['ISO', 'MSME', 'GeM', 'Startup', 'Tender Doc', 'Legal', 'Other'], default: 'Other' },
  client: { type: String, ref: 'Customer' },
  status: { type: String, enum: ['pending', 'submitted', 'approved', 'rejected'], default: 'pending' },
  expiryDate: Date,
  fileUrl: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
