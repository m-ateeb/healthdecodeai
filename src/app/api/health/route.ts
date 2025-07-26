import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Health check: Starting...');
    
    // Test database connection
    await connectDB();
    console.log('Health check: Database connected successfully');
    
    return NextResponse.json({
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasGeminiKey: !!process.env.GEMINI_API_KEY
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
