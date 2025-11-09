const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Invoice = require('../models/Invoice');
const Vendor = require('../models/Vendor');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat - Natural language queries
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Database schema context for Gemini
    const schemaContext = `
Database Schema:
- Collection: invoices
  Fields: invoiceNumber (String), vendor (ObjectId ref), issueDate (Date), 
          dueDate (Date), amount (Number), status (paid/pending/overdue), 
          category (String), items (Array)
  
- Collection: vendors
  Fields: name (String), email (String), phone (String), totalSpend (Number)

Generate a MongoDB aggregation pipeline in JSON format to answer this question.
Return ONLY valid JSON array, no markdown, no explanation.
`;

    const prompt = `${schemaContext}

Question: "${question}"

Generate MongoDB aggregation pipeline:`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response
    let pipeline;
    try {
      // Try to find JSON array in response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        pipeline = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(400).json({ 
        error: 'Could not generate valid query',
        rawResponse: response 
      });
    }
    
    // Execute the aggregation pipeline
    let queryResult;
    try {
      queryResult = await Invoice.aggregate(pipeline);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        error: 'Query execution failed',
        pipeline,
        message: dbError.message
      });
    }
    
    res.json({
      question,
      pipeline,
      results: queryResult,
      resultCount: queryResult.length,
      generatedQuery: JSON.stringify(pipeline, null, 2)
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Chat failed',
      message: error.message 
    });
  }
});

module.exports = router;
