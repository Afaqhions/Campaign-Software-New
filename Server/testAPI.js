import axios from 'axios';

// Test the get-uploads API endpoint
async function testGetUploads() {
  try {
    // You'll need to replace this with a valid JWT token
    // For now, let's test without authentication to see if the endpoint works
    const response = await axios.get('http://localhost:3000/api/get-uploads?email=ahmad@gmail.com', {
      headers: {
        'Authorization': 'Bearer your-jwt-token-here' // Replace with actual token
      }
    });
    
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

testGetUploads();