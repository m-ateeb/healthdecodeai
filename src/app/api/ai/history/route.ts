import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import ChatSession from '@/models/ai/ChatSession';

interface JWTPayload {
  userId: string;
  email: string;
}

async function verifyToken(request: NextRequest): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// GET /api/ai/history?type=report|medication
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'report' or 'medication'
    
    const filter: any = { 
      userId, 
      isActive: true 
    };
    
    if (type && (type === 'report' || type === 'medication')) {
      filter.type = type;
    }

    const sessions = await ChatSession.find(filter)
      .select('sessionId title type createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .limit(50);

    console.log(`History API: Found ${sessions.length} sessions for user ${userId}, type filter: ${type || 'all'}`);
    sessions.forEach(session => {
      console.log(`Session: ${session.sessionId}, type: ${session.type}, messages: ${session.messages.length}`);
    });

    const transformedSessions = sessions.map(session => ({
      sessionId: session.sessionId,
      title: session.title,
      type: session.type || 'report',
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session.messages.length,
      lastMessage: session.messages.length > 0 
        ? session.messages[session.messages.length - 1].content.substring(0, 100) + '...'
        : 'No messages'
    }));

    return NextResponse.json({
      success: true,
      sessions: transformedSessions,
      type: type || 'all',
      total: transformedSessions.length
    });

  } catch (error) {
    console.error('History GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/ai/history?sessionId=xxx or ?type=report|medication&action=clear
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const type = searchParams.get('type');
    const action = searchParams.get('action');

    if (sessionId) {
      // Delete specific session
      const result = await ChatSession.findOneAndUpdate(
        { userId, sessionId, isActive: true },
        { isActive: false },
        { new: true }
      );

      if (!result) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Session deleted successfully',
        sessionId
      });

    } else if (type && action === 'clear' && (type === 'report' || type === 'medication')) {
      // Clear all sessions of specific type
      const result = await ChatSession.updateMany(
        { userId, type, isActive: true },
        { isActive: false }
      );

      return NextResponse.json({
        success: true,
        message: `All ${type} sessions cleared successfully`,
        deletedCount: result.modifiedCount
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid parameters. Provide sessionId or type with action=clear' }, 
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('History DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
