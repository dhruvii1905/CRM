const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['ISO', 'MSME', 'GeM', 'Startup', 'Tender Doc', 'Legal', 'Other'], default: 'Other' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: String, enum: ['pending', 'submitted', 'approved', 'rejected'], default: 'pending' },
  expiryDate: Date,
  fileUrl: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
