const fetch = require('node-fetch');

// Photo mapping for verification
const candidatePhotos = {
  'PRAVEEN KUMAR JHA': 'http://localhost:5000/candidates/PRAVEEN_KUMAR_JHA.png',
  'ALKESH PARASHAR': 'http://localhost:5000/candidates/ALKESH_PARASHAR.png',
  'ASHISH BANSAL (ZINNIA)': 'http://localhost:5000/candidates/ASHISH_BANSAL_(ZINNIA).png',
  'ASHISH BANSAL (ORCHID)': 'http://localhost:5000/candidates/ASHISH_BANSAL_(ORCHID).png',
  'JYOTI VERMA': 'http://localhost:5000/candidates/JYOTI_VERMA.png',
  'KAVITA GUPTA': 'http://localhost:5000/candidates/KAVITA_GUPTA.png',
  'RAHUL KUMAR': 'http://localhost:5000/candidates/RAHUL_KUMAR.png',
  'SUNIL KUMAR DWIVEDI': 'http://localhost:5000/candidates/SUNIL_KUMAR_DWIVEDI.png',
  'SURESH KUMAR VERMA': 'http://localhost:5000/candidates/SURESH_KUMAR_VERMA.png',
  'VAISHALI SINHA': 'http://localhost:5000/candidates/VAISHALI_SINHA.png',
  'VIDIT SRIVASTAVA': 'http://localhost:5000/candidates/VIDIT_SRIVASTAVA.png',
  'VIKRAM SINGH GURJAR': 'http://localhost:5000/candidates/VIKRAM_SINGH_GURJAR.png',
  'VINAY KUMAR SEHRAWAT': 'http://localhost:5000/candidates/VINAY_SEHRAWAT.png',
  'VINOD KUMAR SINGH': 'http://localhost:5000/candidates/VINOD_KUMAR_SINGH.png',
  'VIPIN KUMAR SINGH': 'http://localhost:5000/candidates/VIPIN_KUMAR_SINGH.png',
  'AMIT KUMAR': 'http://localhost:5000/candidates/AMIT_KUMAR.png',
  'ARUN KUMAR': 'http://localhost:5000/candidates/ARUN_KUMAR.png',
  'MAHESH BHATI': 'http://localhost:5000/candidates/MAHESH_BHATI.png',
  'NITIN ANAND': 'http://localhost:5000/candidates/NITIN_ANAND.png',
  'VIJAY KUMAR SHARMA': 'http://localhost:5000/candidates/VIJAY_KUMAR_SHARMA.png',
  'ANIT BHATI': 'http://localhost:5000/candidates/ANIT_BHATI.png'
};

async function testPhotoExists(photoUrl) {
  if (!photoUrl) return false;
  try {
    const response = await fetch(photoUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function verifyAllPhotos() {
  console.log('🔍 Verifying Candidate Photos...\n');
  
  const results = [];
  let totalCandidates = 0;
  let photosAvailable = 0;
  let photosMissing = 0;
  
  for (const [candidateName, photoUrl] of Object.entries(candidatePhotos)) {
    totalCandidates++;
    const exists = await testPhotoExists(photoUrl);
    
    if (exists) {
      photosAvailable++;
      results.push(`✅ ${candidateName} - Photo Available`);
    } else {
      photosMissing++;
      results.push(`❌ ${candidateName} - Photo Missing`);
    }
  }
  
  // Print results
  results.forEach(result => console.log(result));
  
  console.log('\n📊 Summary:');
  console.log(`Total Candidates: ${totalCandidates}`);
  console.log(`Photos Available: ${photosAvailable}`);
  console.log(`Photos Missing: ${photosMissing}`);
  console.log(`Coverage: ${((photosAvailable / totalCandidates) * 100).toFixed(1)}%`);
  
  if (photosMissing > 0) {
    console.log('\n⚠️  Missing Photos:');
    results.filter(r => r.includes('❌')).forEach(r => {
      console.log(`   - ${r.replace('❌ ', '').replace(' - Photo Missing', '')}`);
    });
  }
}

// Run verification
verifyAllPhotos().catch(console.error);
