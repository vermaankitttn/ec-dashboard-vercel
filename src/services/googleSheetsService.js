// Google Sheets API service for React app
// Note: This will need to be connected to a backend API since React can't directly use Google Sheets API
// For now, we'll create a mock service that can be easily replaced with real API calls

class GoogleSheetsService {
  constructor() {
    this.credentialsFile = 'ec-results-credentials.json';
    this.spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1wQrOseeikbaJnF3_twiuI-FmSKo9tLTly02eFTCCLGQ/edit?gid=1422280249#gid=1422280249';
  }

  // Mock method - replace with actual API call to your backend
  async loadData() {
    try {
      // In a real implementation, this would be a fetch call to your backend API
      // const response = await fetch('/api/google-sheets-data');
      // const data = await response.json();
      
      // For now, return mock data that matches the structure
      return this.getMockData();
    } catch (error) {
      console.error('Error loading Google Sheets data:', error);
      throw error;
    }
  }

  // Mock data that matches your real data structure
  getMockData() {
    return [
      {
        id: 1,
        name: "VIPIN KUMAR SINGH",
        flat: "1725",
        totalCount: 14,
        totalValue: 25.41,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 14 },
        position: 1
      },
      {
        id: 2,
        name: "KAVITA GUPTA",
        flat: "2430",
        totalCount: 15,
        totalValue: 24.34,
        votes: { "920": 0, "1005": 4, "1165": 0, "1285": 0, "1670": 11 },
        position: 2
      },
      {
        id: 3,
        name: "VIDIT SRIVASTAVA",
        flat: "2429",
        totalCount: 6,
        totalValue: 10.89,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 6 },
        position: 3
      },
      {
        id: 4,
        name: "MAHESH BHATI",
        flat: "435",
        totalCount: 3,
        totalValue: 4.19,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 3, "1670": 0 },
        position: 4
      },
      {
        id: 5,
        name: "JYOTI VERMA",
        flat: "1931",
        totalCount: 3,
        totalValue: 3.8,
        votes: { "920": 0, "1005": 0, "1165": 3, "1285": 0, "1670": 0 },
        position: 5
      },
      {
        id: 6,
        name: "ALKESH PARASHAR",
        flat: "2602",
        totalCount: 0,
        totalValue: 0.0,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 0 },
        position: 6
      },
      {
        id: 7,
        name: "AMIT KUMAR",
        flat: "718",
        totalCount: 0,
        totalValue: 0.0,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 0 },
        position: 7
      },
      {
        id: 8,
        name: "ANIT BHATI",
        flat: "634",
        totalCount: 0,
        totalValue: 0.0,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 0 },
        position: 8
      },
      {
        id: 9,
        name: "ARUN KUMAR",
        flat: "1912",
        totalCount: 0,
        totalValue: 0.0,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 0 },
        position: 9
      },
      {
        id: 10,
        name: "ASHISH BANSAL",
        flat: "1234",
        totalCount: 0,
        totalValue: 0.0,
        votes: { "920": 0, "1005": 0, "1165": 0, "1285": 0, "1670": 0 },
        position: 10
      }
    ];
  }

  // Method to transform Google Sheets data to our format
  transformGoogleSheetsData(sheetsData) {
    if (!sheetsData || !sheetsData.length) {
      return [];
    }

    return sheetsData.map((row, index) => ({
      id: index + 1,
      name: row['Candidate Name'] || `Candidate ${index + 1}`,
      flat: row['Flat#'] || 'N/A',
      totalCount: parseInt(row['Total Vote Count']) || 0,
      totalValue: parseFloat(row['Total Vote Value']) || 0.0,
      votes: {
        "920": parseInt(row['920']) || 0,
        "1005": parseInt(row['1005']) || 0,
        "1165": parseInt(row['1165']) || 0,
        "1285": parseInt(row['1285']) || 0,
        "1670": parseInt(row['1670']) || 0
      },
      position: index + 1
    }));
  }
}

const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;

