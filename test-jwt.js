// Quick test for JWT token generation
const testJWT = () => {
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = '1234567890abcdef1234567890abcdef'; // From .env.local
  
  const payload = {
    userId: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User'
  };
  
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Token generated:', {
      length: token.length,
      payload: payload
    });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified:', {
      userId: decoded.userId,
      email: decoded.email
    });
    
  } catch (error) {
    console.log('❌ JWT error:', error.message);
  }
};

testJWT();
