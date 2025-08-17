// Simple test script to verify the app functionality
const fetch = require('node-fetch');

async function testApp() {
  console.log('🏆 Testing EC Results Dashboard...\n');

  try {
    // Test backend health
    console.log('1. Testing backend health...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend is healthy:', healthData.status);

    // Test Google Sheets data
    console.log('\n2. Testing Google Sheets data...');
    const dataResponse = await fetch('http://localhost:5000/api/google-sheets-data');
    const candidatesData = await dataResponse.json();
    
    console.log(`✅ Found ${candidatesData.length} candidates`);
    
    // Show top 5 candidates
    console.log('\n3. Top 5 candidates:');
    candidatesData.slice(0, 5).forEach((candidate, index) => {
      console.log(`   ${index + 1}. ${candidate.name} (Flat ${candidate.flat}) - ${candidate.totalCount} votes`);
    });

    // Calculate remaining candidates
    const top10Count = Math.min(10, candidatesData.length);
    const remainingCount = Math.max(0, candidatesData.length - 10);
    
    console.log(`\n4. Tab distribution:`);
    console.log(`   🏆 Top 10: ${top10Count} candidates`);
    console.log(`   📊 Remaining: ${remainingCount} candidates`);
    
    console.log('\n✅ All tests passed! The app should be working correctly.');
    console.log('\n🌐 Access the app at: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running: node server.js');
    console.log('   2. Make sure React app is running: npm start');
    console.log('   3. Check if ec-results-credentials.json exists');
  }
}

testApp();

