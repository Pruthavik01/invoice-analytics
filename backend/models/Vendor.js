const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: String,
  address: String,
  totalSpend: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);

