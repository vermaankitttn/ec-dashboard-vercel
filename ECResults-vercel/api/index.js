const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://*.vercel.app', 'https://*.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Google Sheets configuration
const auth = new google.auth.GoogleAuth({
  keyFile: './ec-results-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EC Results API is running',
    timestamp: new Date().toISOString()
  });
});

// Google Sheets API endpoint
app.get('/api/google-sheets-data', async (req, res) => {
  try {
    const spreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
    const range = 'Sheet1!A:E';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found.' });
    }

    // Process the data
    const headers = rows[0];
    const data = rows.slice(1).map((row, index) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || '';
      });
      obj.position = index + 1; // Add position number
      return obj;
    });

    res.json({
      success: true,
      data: data,
      totalCount: data.length
    });

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from Google Sheets',
      details: error.message 
    });
  }
});

// Serve static files (candidate photos)
app.use('/candidates', express.static('./public/candidates'));

module.exports = app;
