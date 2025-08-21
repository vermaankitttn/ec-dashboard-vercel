const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const app = express();

require('dotenv').config()

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Serve candidate photos with proper CORS headers and mobile support
app.use('/candidates', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, User-Agent');
  res.header('Cache-Control', 'public, max-age=3600');
  res.header('Vary', 'Accept-Encoding, User-Agent');
  res.header('Accept-Ranges', 'bytes');
  
  // Handle preflight requests for mobile browsers
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}, express.static(path.join(__dirname, 'public/candidates')));

// Google Sheets configuration
const SPREADSHEET_URL = process.env.GOOGLE_SHEETS_URL || 'https://docs.google.com/spreadsheets/d/1wQrOseeikbaJnF3_twiuI-FmSKo9tLTly02eFTCCLGQ/edit?gid=905796284#gid=905796284';

// Extract spreadsheet ID from URL
const SPREADSHEET_ID = SPREADSHEET_URL.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

if (!SPREADSHEET_ID) {
  console.error('Invalid Google Sheets URL');
  process.exit(1);
}

// Load Google Sheets credentials from environment variables
let auth;
try {
  // Check if all required environment variables are present
  const requiredEnvVars = ['GOOGLE_PROJECT_ID', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_CLIENT_EMAIL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Create credentials object from environment variables
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN || 'googleapis.com'
  };

  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  console.log('✅ Google Sheets credentials loaded from environment variables');
} catch (error) {
  console.error('❌ Error loading Google Sheets credentials:', error.message);
  console.log('Please ensure all required environment variables are set:');
  console.log('- GOOGLE_PROJECT_ID');
  console.log('- GOOGLE_PRIVATE_KEY');
  console.log('- GOOGLE_CLIENT_EMAIL');
  console.log('Optionally:');
  console.log('- GOOGLE_PRIVATE_KEY_ID');
  console.log('- GOOGLE_CLIENT_ID');
  console.log('- GOOGLE_SHEETS_URL');
  process.exit(1);
}

// Google Sheets API endpoint
app.get('/api/google-sheets-data', async (req, res) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get the sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Display!A2:K', // Reading from Display sheet
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
      });

    // Sort by total value in descending order
    transformedData.sort((a, b) => b.totalValue - a.totalValue);
    
    // Update positions after sorting
    transformedData.forEach((candidate, index) => {
      candidate.position = index + 1;
    });

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from Google Sheets',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


// Mobile photo test endpoint
app.get('/api/test-photos', (req, res) => {
  const fs = require('fs');
  const photoDir = path.join(__dirname, 'public/candidates');
  
  try {
    const photos = fs.readdirSync(photoDir)
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        name: file.replace('.png', '').replace(/_/g, ' '),
        url: `https://ska-ec-backend-2025-aug.loca.lt/candidates/${file}`,
        filename: file
      }));
    
    res.json({
      status: 'OK',
      totalPhotos: photos.length,
      photos: photos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Google Sheets API endpoint: http://localhost:${PORT}/api/google-sheets-data`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
