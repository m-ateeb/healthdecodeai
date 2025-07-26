#!/usr/bin/env node

// Deployment verification script for HealthDecodeAI
// Run with: node verify-deployment.js https://your-app.vercel.app

const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = process.argv[2] || 'http://localhost:3000';

console.log(`🔍 Testing HealthDecodeAI deployment at: ${BASE_URL}\n`);

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const req = lib.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`Testing ${name}...`);
    const response = await makeRequest(`${BASE_URL}${url}`, options);
    console.log(`✅ ${name}: ${response.status} ${getStatusText(response.status)}`);
    if (response.data && response.data.error) {
      console.log(`   Error: ${response.data.error}`);
    }
    if (response.data && response.data.message) {
      console.log(`   Message: ${response.data.message}`);
    }
    return response;
  } catch (error) {
    console.log(`❌ ${name}: Failed - ${error.message}`);
    return null;
  }
}

function getStatusText(status) {
  const statusTexts = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    404: 'Not Found',
    500: 'Internal Server Error'
  };
  return statusTexts[status] || 'Unknown';
}

async function runTests() {
  console.log('🧪 Running deployment verification tests...\n');

  // Test 1: Health check (homepage)
  await testEndpoint('Homepage', '/');

  // Test 2: Login page
  await testEndpoint('Login Page', '/login');

  // Test 3: Signup page  
  await testEndpoint('Signup Page', '/signup');

  // Test 4: Test signup API with invalid data
  await testEndpoint('Signup API (validation)', '/api/auth/signup', {
    method: 'POST',
    body: { email: 'test@example.com' } // Missing required fields
  });

  // Test 5: Test login API with invalid data
  await testEndpoint('Login API (validation)', '/api/auth/login', {
    method: 'POST', 
    body: { email: 'test@example.com' } // Missing password
  });

  // Test 6: Test forgot password API with invalid data
  await testEndpoint('Forgot Password API (validation)', '/api/auth/forgot-password', {
    method: 'POST',
    body: {} // Missing email
  });

  // Test 7: Test /me endpoint (should fail without auth)
  await testEndpoint('Auth Check API', '/api/auth/me');

  console.log('\n🎯 Test Summary:');
  console.log('- If all endpoints return expected status codes, your deployment is working!');
  console.log('- 400 errors for validation are expected and good');
  console.log('- 500 errors indicate configuration issues (check environment variables)');
  console.log('- Connection errors indicate deployment/networking issues');
  
  console.log('\n📝 Next Steps:');
  console.log('1. If tests pass: Try creating a real account through the UI');
  console.log('2. If 500 errors: Check Vercel function logs for detailed errors');
  console.log('3. If connection errors: Verify the URL and deployment status');
  
  console.log('\n📊 Environment Check:');
  console.log('Make sure these environment variables are set in Vercel:');
  console.log('- MONGODB_URI');
  console.log('- JWT_SECRET'); 
  console.log('- RESEND_API_KEY');
  console.log('- RESEND_FROM_EMAIL');
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, makeRequest };
