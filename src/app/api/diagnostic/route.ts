import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.substring(0, 20) + '...' : 'Missing',
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasResendEmail: !!process.env.RESEND_FROM_EMAIL,
      resendEmail: process.env.RESEND_FROM_EMAIL || 'Missing',
      timestamp: new Date().toISOString()
    };

    console.log('Environment diagnostic:', envCheck);

    return NextResponse.json({
      status: 'Environment check complete',
      environment: envCheck,
      message: 'Check Vercel function logs for detailed environment info'
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({ 
      error: 'Diagnostic failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
