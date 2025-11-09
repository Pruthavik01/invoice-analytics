const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true,
    unique: true 
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: { 
    type: String, 
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  category: {
    type: String,
    default: 'General'
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  paymentDate: Date,
  notes: String
}, {
  timestamps: true
});

// Auto-update status based on due date
invoiceSchema.pre('save', function(next) {
  if (this.status === 'pending' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);