import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    const connection = await connectDB();
    
    console.log('Database connection successful:', {
      readyState: connection.connection.readyState,
      host: connection.connection.host,
      name: connection.connection.name
    });

    return NextResponse.json({
      status: 'Database connection successful',
      readyState: connection.connection.readyState,
      host: connection.connection.host,
      dbName: connection.connection.name,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError'
    });

    return NextResponse.json({ 
      status: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
