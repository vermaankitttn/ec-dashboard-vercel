const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Google Sheets configuration
const CREDENTIALS_FILE = 'ec-results-credentials.json';
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1wQrOseeikbaJnF3_twiuI-FmSKo9tLTly02eFTCCLGQ/edit?gid=1422280249#gid=1422280249';

// Extract spreadsheet ID from URL
const SPREADSHEET_ID = SPREADSHEET_URL.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

if (!SPREADSHEET_ID) {
  console.error('Invalid Google Sheets URL');
  process.exit(1);
}

// Load Google Sheets credentials
let auth;
try {
  const credentials = require(`../${CREDENTIALS_FILE}`);
  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
} catch (error) {
  console.error('Error loading credentials file:', error.message);
  console.log('Please ensure ec-results-credentials.json is in the root directory');
  process.exit(1);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Google Sheets API endpoint
app.get('/api/google-sheets-data', async (req, res) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get the sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Final!A2:K', // Adjust range as needed
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // Transform the data to match the expected format
    const transformedData = rows
      .filter((row, index) => {
        // Filter out header rows and empty rows
        if (!row || row.length < 2) return false;
        if (row[1] === 'Candidate Name' || row[1] === 'CANDIDATE NAME') return false;
        if (row[1] === '' || row[1] === null || row[1] === undefined) return false;
        return true;
      })
      .map((row, index) => {
        // Assuming the columns are in this order:
        // S.No, Candidate Name, Tower, Flat#, 920, 1005, 1165, 1285, 1670, Total Vote Count, Total Vote Value
        return {
          id: index + 1,
          name: row[1] || `Candidate ${index + 1}`,
          flat: row[3] || 'N/A',
          totalCount: parseInt(row[9]) || 0,
          totalValue: parseFloat(row[10]) || 0.0,
          votes: {
            "920": parseInt(row[4]) || 0,
            "1005": parseInt(row[5]) || 0,
            "1165": parseInt(row[6]) || 0,
            "1285": parseInt(row[7]) || 0,
            "1670": parseInt(row[8]) || 0
          },
          position: index + 1
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue) // Sort by total value descending
      .map((candidate, index) => ({
        ...candidate,
        position: index + 1
      }));

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
  }
});

// Export for Vercel
module.exports = app;
