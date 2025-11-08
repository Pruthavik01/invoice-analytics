const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Invoice = require('../models/Invoice');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat - Ask questions about data
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    
    // Get database schema info
    const sampleInvoice = await Invoice.findOne().populate('vendor');
    
    const prompt = `
You are a MongoDB query assistant. Given this database schema:

Collection: invoices
Fields: invoiceNumber, vendor (ref), date, dueDate, amount, status, category, items

Collection: vendors
Fields: name, email, phone, totalSpend

User question: "${question}"

Generate a MongoDB aggregation pipeline as a JSON array. Only return the JSON array, no explanation.

Example format:
[
  { "$match": { "status": "paid" } },
  { "$group": { "_id": null, "total": { "$sum": "$amount" } } }
]
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(400).json({ error: 'Could not generate query' });
    }
    
    const pipeline = JSON.parse(jsonMatch[0]);
    
    // Execute the query
    const queryResult = await Invoice.aggregate(pipeline);
    
    res.json({
      question,
      pipeline,
      results: queryResult,
      sql: JSON.stringify(pipeline, null, 2) // For display
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;