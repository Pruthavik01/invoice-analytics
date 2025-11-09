const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET /api/invoices - Get all invoices with filters
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      status, 
      page = 1, 
      limit = 10,
      sortBy = 'issueDate',
      sortOrder = 'desc'
    } = req.query;
    
    let query = {};
    
    // Search filter (invoice number or vendor name)
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const invoices = await Invoice.find(query)
      .populate('vendor', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const count = await Invoice.countDocuments(query);
    
    res.json({
      invoices,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      hasMore: page * limit < count
    });
  } catch (error) {
    console.error('Invoices error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/invoices/:id - Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('vendor');
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Invoice detail error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

