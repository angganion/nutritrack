// Test script untuk API POST /api/submit
// Jalankan dengan: node test-submit-api.js

const API_BASE_URL = 'http://localhost:3000';

// Dummy data untuk testing
const dummyData = {
  gender: "male",
  age: 24,
  birth_weight: 3.2,
  birth_length: 50.0,
  body_weight: 12.5,
  body_length: 85.0,
  breast_feeding: true,
  stunting: false,
  image_is_stunting: false,
  latitude: -6.2088,
  longitude: 106.8456
};

// Multiple test cases
const testCases = [
  {
    name: "Test Case 1: Anak laki-laki normal",
    data: {
      gender: "male",
      age: 24,
      birth_weight: 3.2,
      birth_length: 50.0,
      body_weight: 12.5,
      body_length: 85.0,
      breast_feeding: true,
      stunting: false,
      image_is_stunting: false,
      latitude: -6.2088,
      longitude: 106.8456
    }
  },
  {
    name: "Test Case 2: Anak perempuan dengan stunting",
    data: {
      gender: "female",
      age: 30,
      birth_weight: 2.8,
      birth_length: 48.0,
      body_weight: 10.2,
      body_length: 78.0,
      breast_feeding: false,
      stunting: true,
      image_is_stunting: true,
      latitude: -7.7956,
      longitude: 110.3695
    }
  },
  {
    name: "Test Case 3: Anak laki-laki tanpa koordinat",
    data: {
      gender: "male",
      age: 18,
      birth_weight: 3.5,
      birth_length: 52.0,
      body_weight: 11.8,
      body_length: 82.0,
      breast_feeding: true,
      stunting: false,
      image_is_stunting: false
      // Tidak ada latitude/longitude
    }
  },
  {
    name: "Test Case 4: Anak perempuan muda",
    data: {
      gender: "female",
      age: 12,
      birth_weight: 2.9,
      birth_length: 47.0,
      body_weight: 8.5,
      body_length: 72.0,
      breast_feeding: true,
      stunting: false,
      image_is_stunting: false,
      latitude: -8.6500,
      longitude: 115.2167
    }
  }
];

async function testSubmitAPI() {
  console.log('🚀 Memulai test API POST /api/submit\n');

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`📋 ${testCase.name}`);
    console.log('📤 Data yang dikirim:', JSON.stringify(testCase.data, null, 2));

    try {
      const response = await fetch(`${API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Status:', response.status);
        console.log('📥 Response:', JSON.stringify(result, null, 2));
        
        if (result.alamat) {
          console.log('🏠 Alamat dibuat:', result.alamat.state, result.alamat.city);
        }
      } else {
        console.log('❌ Status:', response.status);
        console.log('📥 Error:', JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.log('💥 Error:', error.message);
    }
    
    console.log('─'.repeat(80));
    console.log('');
    
    // Delay antar test
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Test dengan data invalid
async function testInvalidData() {
  console.log('🧪 Testing dengan data invalid\n');

  const invalidTests = [
    {
      name: "Missing required field (gender)",
      data: {
        age: 24,
        birth_weight: 3.2,
        birth_length: 50.0,
        body_weight: 12.5,
        body_length: 85.0,
        breast_feeding: true,
        stunting: false,
        image_is_stunting: false
      }
    },
    {
      name: "Invalid latitude",
      data: {
        gender: "male",
        age: 24,
        birth_weight: 3.2,
        birth_length: 50.0,
        body_weight: 12.5,
        body_length: 85.0,
        breast_feeding: true,
        stunting: false,
        image_is_stunting: false,
        latitude: 200, // Invalid latitude
        longitude: 106.8456
      }
    },
    {
      name: "Invalid longitude",
      data: {
        gender: "female",
        age: 24,
        birth_weight: 3.2,
        birth_length: 50.0,
        body_weight: 12.5,
        body_length: 85.0,
        breast_feeding: true,
        stunting: false,
        image_is_stunting: false,
        latitude: -6.2088,
        longitude: 300 // Invalid longitude
      }
    }
  ];

  for (const test of invalidTests) {
    console.log(`📋 ${test.name}`);
    console.log('📤 Data yang dikirim:', JSON.stringify(test.data, null, 2));

    try {
      const response = await fetch(`${API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data)
      });

      const result = await response.json();
      
      console.log('📥 Status:', response.status);
      console.log('📥 Response:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('💥 Error:', error.message);
    }
    
    console.log('─'.repeat(80));
    console.log('');
  }
}

// Test untuk memeriksa data yang sudah tersimpan
async function testGetData() {
  console.log('📊 Testing GET data setelah submit\n');

  try {
    // Test get children data
    const response = await fetch(`${API_BASE_URL}/api/children`);
    const result = await response.json();
    
    console.log('📥 Status:', response.status);
    console.log('📊 Total children:', result.length);
    
    if (result.length > 0) {
      console.log('📋 Sample data:', JSON.stringify(result[0], null, 2));
    }
  } catch (error) {
    console.log('💥 Error:', error.message);
  }
}

// Main function
async function runAllTests() {
  console.log('🧪 NUTRITRACK API TESTING SUITE');
  console.log('================================\n');

  await testSubmitAPI();
  await testInvalidData();
  await testGetData();

  console.log('✅ Semua test selesai!');
}

// Jalankan test jika file dijalankan langsung
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testSubmitAPI,
  testInvalidData,
  testGetData,
  runAllTests,
  dummyData,
  testCases
};
