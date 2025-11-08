// models/Vendor.js
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  totalSpend: { type: Number, default: 0 }
});

module.exports = mongoose.model('Vendor', vendorSchema);