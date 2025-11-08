// models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  date: Date,
  dueDate: Date,
  amount: Number,
  status: { type: String, enum: ['paid', 'pending', 'overdue'] },
  category: String,
  items: [{
    description: String,
    quantity: Number,
    price: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);