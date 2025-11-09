const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Vendor = require('../models/Vendor');

// GET /api/stats - Overview cards data
router.get('/', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Total invoices this year
    const totalInvoices = await Invoice.countDocuments({
      issueDate: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`)
      }
    });
    
    // Total spend (YTD)
    const spendData = await Invoice.aggregate([
      {
        $match: {
          issueDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalSpend = spendData[0]?.total || 0;
    const avgInvoiceValue = totalInvoices > 0 ? totalSpend / totalInvoices : 0;
    
    res.json({
      totalSpend: totalSpend.toFixed(2),
      totalInvoices,
      documentsUploaded: totalInvoices,
      avgInvoiceValue: avgInvoiceValue.toFixed(2)
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/trends - Monthly invoice volume + value
router.get('/trends', async (req, res) => {
  try {
    const trends = await Invoice.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$issueDate' },
            year: { $year: '$issueDate' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { 
        $sort: { '_id.year': 1, '_id.month': 1 } 
      },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          count: 1,
          totalAmount: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(trends);
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/vendors/top10 - Top 10 vendors by spend
router.get('/vendors/top10', async (req, res) => {
  try {
    const topVendors = await Invoice.aggregate([
      {
        $group: {
          _id: '$vendor',
          totalSpend: { $sum: '$amount' },
          invoiceCount: { $sum: 1 }
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
      },
      {
        $project: {
          vendorName: { $arrayElemAt: ['$vendorInfo.name', 0] },
          totalSpend: 1,
          invoiceCount: 1
        }
      }
    ]);
    
    res.json(topVendors);
  } catch (error) {
    console.error('Top vendors error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/categories - Spend by category
router.get('/categories', async (req, res) => {
  try {
    const categories = await Invoice.aggregate([
      {
        $group: {
          _id: '$category',
          totalSpend: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSpend: -1 } },
      {
        $project: {
          category: '$_id',
          totalSpend: 1,
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/cashflow - Cash outflow forecast
router.get('/cashflow', async (req, res) => {
  try {
    const today = new Date();
    const next90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    const cashflow = await Invoice.aggregate([
      {
        $match: {
          status: { $in: ['pending', 'overdue'] },
          dueDate: { $lte: next90Days }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$dueDate' },
            year: { $year: '$dueDate' }
          },
          totalDue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json(cashflow);
  } catch (error) {
    console.error('Cashflow error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;