const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const invoiceSchema = new mongoose.Schema({
  _id: { type: String, default: generateId },
  invoiceNo: { type: String, unique: true },
  client: { type: String, ref: 'Customer', required: true },
  service: String,
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue'], default: 'pending' },
  dueDate: Date,
  notes: String
}, { timestamps: true });

invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNo) {
    const date = new Date();
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const count = await mongoose.model('Invoice').countDocuments();
    const seq = String(count + 1).padStart(5, '0');
    this.invoiceNo = `INV${datePart}${seq}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
