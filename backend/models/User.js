const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const userSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
