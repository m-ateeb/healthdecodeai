// Test authentication flow
const testAuth = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('Testing authentication flow...');
  
  // Test login
  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mateebsaleemi@gmail.com',
        password: 'your-password-here' // Replace with actual password
      }),
      credentials: 'include' // Important for cookies
    });
    
    const loginData = await loginRes.json();
    console.log('✅ Login:', loginRes.ok ? 'PASS' : `FAIL - ${loginData.error}`);
    
    if (loginRes.ok) {
      // Extract cookies
      const cookies = loginRes.headers.get('set-cookie');
      console.log('Cookies set:', !!cookies);
      
      // Test authenticated API call
      const chatRes = await fetch(`${baseUrl}/api/ai/chat`, {
        method: 'GET',
        credentials: 'include'
      });
      
      console.log('✅ Chat API (with auth):', chatRes.status === 200 ? 'PASS' : `FAIL (status: ${chatRes.status})`);
      
      const reportsRes = await fetch(`${baseUrl}/api/ai/reports`, {
        method: 'GET', 
        credentials: 'include'
      });
      
      console.log('✅ Reports API (with auth):', reportsRes.status === 200 ? 'PASS' : `FAIL (status: ${reportsRes.status})`);
    }
    
  } catch (error) {
    console.log('❌ Auth test: FAIL -', error.message);
  }
};

testAuth();
