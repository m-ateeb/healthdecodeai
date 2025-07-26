import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import ChatSession, { IChatMessage } from '@/models/ai/ChatSession';
import { createAIService, DEFAULT_AI_CONFIG, HEALTH_PROMPTS, ChatCompletionMessage } from '@/lib/ai-service';

interface JWTPayload {
  userId: string;
  email: string;
}

async function verifyToken(request: NextRequest): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('Token verification:', {
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    if (!token) {
      console.log('No token found in cookies');
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    console.log('Token decoded successfully:', {
      userId: decoded.userId,
      email: decoded.email
    });
    return decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, sessionId, type } = body;
    
    console.log('Chat API request body:', { message: message?.substring(0, 50) + '...', sessionId, type });

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' }, 
        { status: 400 }
      );
    }

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ 
      userId, 
      sessionId,
      isActive: true 
    });

    if (!chatSession) {
      // Determine session type from sessionId or provided type
      let sessionType = 'report'; // default
      
      if (type) {
        sessionType = type;
      } else if (sessionId.includes('medication')) {
        sessionType = 'medication';
      }
      
      console.log(`Creating new chat session: ${sessionId}, type: ${sessionType}, provided type: ${type}, sessionId contains medication: ${sessionId.includes('medication')}`);
      
      chatSession = new ChatSession({
        userId,
        sessionId,
        type: sessionType,
        title: sessionType === 'medication' 
          ? 'Medication Information Check'
          : 'Medical Report Analysis',
        messages: []
      });
    } else {
      console.log(`Found existing chat session: ${sessionId}, type: ${chatSession.type}`);
    }

    // Add user message
    const userMessage: IChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    chatSession.messages.push(userMessage);

    // Prepare messages for AI service
    const messages: ChatCompletionMessage[] = [
      { role: 'system', content: HEALTH_PROMPTS.system },
      ...chatSession.messages.map((msg: IChatMessage): ChatCompletionMessage => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    // Get AI response
    const aiService = createAIService(DEFAULT_AI_CONFIG);
    const aiResponse = await aiService.generateChatCompletion(messages);

    // Add AI response to session
    const assistantMessage: IChatMessage = {
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: {
        model: aiResponse.model,
        usage: aiResponse.usage
      }
    };

    chatSession.messages.push(assistantMessage);
    await chatSession.save();
    console.log(`Saved chat session: ${chatSession.sessionId}, type: ${chatSession.type}, messages: ${chatSession.messages.length}`);

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sessionId: chatSession.sessionId,
      usage: aiResponse.usage
    });

  } catch (error) {
    console.error('Chat POST API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Chat GET API: Starting request...');
    await connectDB();
    console.log('Chat GET API: Database connected');
    
    const userId = await verifyToken(request);
    console.log('Chat GET API: User ID:', userId);
    if (!userId) {
      console.log('Chat GET API: Unauthorized - no user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      // Get all chat sessions for user
      console.log('Chat GET API: Fetching all sessions for user:', userId);
      const sessions = await ChatSession.find({ 
        userId, 
        isActive: true 
      })
        .select('sessionId title type createdAt updatedAt messages')
        .sort({ updatedAt: -1 })
        .limit(20);

      console.log('Chat GET API: Found sessions:', sessions.length);
      return NextResponse.json({
        success: true,
        sessions: sessions.map(session => ({
          sessionId: session.sessionId,
          title: session.title,
          type: session.type || 'report', // fallback for existing sessions
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          messageCount: session.messages.length
        }))
      });
    } else {
      // Get specific chat session
      const session = await ChatSession.findOne({ 
        userId, 
        sessionId,
        isActive: true 
      });

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' }, 
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        session: {
          sessionId: session.sessionId,
          title: session.title,
          type: session.type || 'report', // fallback for existing sessions
          messages: session.messages,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        }
      });
    }

  } catch (error) {
    console.error('Chat GET API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
