import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Test login: Starting...');
    
    // Generate a test token
    const token = generateToken({ 
      userId: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User'
    });
    
    console.log('Test login: Token generated', {
      tokenLength: token.length,
      userId: '507f1f77bcf86cd799439011'
    });

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      message: 'Test login successful',
      tokenLength: token.length
    });

    // Try different cookie settings
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    console.log('Test login: Cookie set');
    return response;
    
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { error: 'Test login failed' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    console.log('Test auth check:', {
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    return NextResponse.json({
      hasToken: !!token,
      tokenLength: token?.length || 0
    });
    
  } catch (error) {
    console.error('Test auth check error:', error);
    return NextResponse.json(
      { error: 'Test auth check failed' }, 
      { status: 500 }
    );
  }
}
