const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Vendor = require('../models/Vendor');

// GET /api/stats - Dashboard overview cards
router.get('/', async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const totalSpend = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const avgInvoiceValue = totalSpend[0]?.total / totalInvoices || 0;
    
    res.json({
      totalSpend: totalSpend[0]?.total || 0,
      totalInvoices,
      documentsUploaded: totalInvoices,
      avgInvoiceValue: avgInvoiceValue.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/trends - Monthly invoice trends
router.get('/trends', async (req, res) => {
  try {
    const trends = await Invoice.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/vendors/top10
router.get('/vendors/top10', async (req, res) => {
  try {
    const topVendors = await Invoice.aggregate([
      {
        $group: {
          _id: '$vendor',
          totalSpend: { $sum: '$amount' }
        }
      },
      { $sort: { totalSpend: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorInfo'
        }
      }
    ]);
    
    res.json(topVendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Invoice.aggregate([
      {
        $group: {
          _id: '$category',
          totalSpend: { $sum: '$amount' }
        }
      },
      { $sort: { totalSpend: -1 } }
    ]);
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;