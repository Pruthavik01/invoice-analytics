const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET /api/invoices - Get all invoices with filters
router.get('/', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.invoiceNumber = { $regex: search, $options: 'i' };
    }
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    const invoices = await Invoice.find(query)
      .populate('vendor')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Invoice.countDocuments(query);
    
    res.json({
      invoices,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;