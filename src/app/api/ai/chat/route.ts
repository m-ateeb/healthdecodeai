import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import ChatSession, { IChatMessage } from '@/models/ai/ChatSession';
import MedicalReport from '@/models/ai/MedicalReport';
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

async function generateChatTitle(message: string, sessionType: 'report' | 'medication'): Promise<string> {
  try {
    const aiService = createAIService(DEFAULT_AI_CONFIG);
    
    const titlePrompt = sessionType === 'medication' 
      ? `Generate a short, specific title (max 50 characters) for a medication consultation based on this user message: "${message}". Focus on the main medication or health concern mentioned. Examples: "Metformin Side Effects", "Blood Pressure Medication", "Antibiotic Questions". Return only the title, nothing else.`
      : `Generate a short, specific title (max 50 characters) for a medical report analysis based on this user message: "${message}". Focus on the main medical concern or report type mentioned. Examples: "Blood Test Results", "X-Ray Analysis", "Liver Function Report". Return only the title, nothing else.`;

    const response = await aiService.generateChatCompletion([
      { role: 'system', content: 'You are a helpful assistant that generates concise, specific titles for medical conversations.' },
      { role: 'user', content: titlePrompt }
    ]);

    let title = response.content.trim();
    
    // Clean up the title - remove quotes and limit length
    title = title.replace(/["""]/g, '').trim();
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    // Fallback to default if title is too generic or empty
    if (!title || title.length < 3 || title.toLowerCase().includes('title') || title.toLowerCase().includes('analysis')) {
      return sessionType === 'medication' ? 'Medication Consultation' : 'Medical Report Analysis';
    }
    
    return title;
  } catch (error) {
    console.error('Error generating chat title:', error);
    return sessionType === 'medication' ? 'Medication Consultation' : 'Medical Report Analysis';
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

    // Convert userId to ObjectId for proper comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ 
      userId: userObjectId, 
      sessionId,
      isActive: true 
    });

    if (!chatSession) {
      // Determine session type from sessionId or provided type
      let sessionType: 'report' | 'medication' = 'report'; // default
      
      if (type === 'medication' || type === 'report') {
        sessionType = type;
      } else if (sessionId.includes('medication')) {
        sessionType = 'medication';
      }
      
      console.log(`Creating new chat session: ${sessionId}, type: ${sessionType}, provided type: ${type}, sessionId contains medication: ${sessionId.includes('medication')}`);
      
      // Generate title based on first message
      let title = sessionType === 'medication' 
        ? 'Medication Information Check'
        : 'Medical Report Analysis';

      // If this is the first message, generate a more specific title
      if (message && message.length > 10) {
        try {
          title = await generateChatTitle(message, sessionType);
          console.log(`Generated dynamic title: ${title}`);
        } catch (error) {
          console.error('Failed to generate title:', error);
          // Keep default title
        }
      }
      
      chatSession = new ChatSession({
        userId: userObjectId,
        sessionId,
        type: sessionType,
        title: title,
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

    // For report analysis sessions, get the latest medical report context
    let reportContext = '';
    if (chatSession.type === 'report' || sessionId.includes('report')) {
      try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const latestReport = await MedicalReport.findOne({ 
          userId: userObjectId,
          analysisStatus: 'completed'
        }).sort({ uploadedAt: -1 });

        if (latestReport) {
          console.log(`Found latest report: ${latestReport.originalName}, analysis status: ${latestReport.analysisStatus}`);
          
          // Include the extracted text and AI analysis in context
          reportContext = `\n\nMEDICAL REPORT CONTEXT:
File: ${latestReport.originalName}
Type: ${latestReport.reportType}
Uploaded: ${latestReport.uploadedAt}

EXTRACTED TEXT FROM REPORT:
${latestReport.extractedText}

PREVIOUS AI ANALYSIS:
${latestReport.aiAnalysis?.summary || 'No analysis available'}

Please use this medical report information to answer the user's questions about their health report.`;

          console.log(`Added report context for chat session, extracted text length: ${latestReport.extractedText?.length || 0}`);
        } else {
          console.log('No completed medical reports found for user');
        }
      } catch (error) {
        console.error('Error fetching medical report context:', error);
      }
    }

    // Prepare messages for AI service
    const systemMessage = chatSession.type === 'report' && reportContext 
      ? HEALTH_PROMPTS.system + reportContext
      : HEALTH_PROMPTS.system;
      
    const messages: ChatCompletionMessage[] = [
      { role: 'system', content: systemMessage },
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
    
    // Convert userId to ObjectId for proper comparison
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!sessionId) {
      // Get all chat sessions for user
      console.log('Chat GET API: Fetching all sessions for user:', userId);
      const sessions = await ChatSession.find({ 
        userId: userObjectId, 
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
      console.log('Chat GET API: Fetching session:', sessionId, 'for user:', userId);
      const session = await ChatSession.findOne({ 
        userId: userObjectId, 
        sessionId,
        isActive: true 
      });

      if (!session) {
        console.log('Chat GET API: Session not found:', sessionId);
        return NextResponse.json(
          { error: 'Session not found' }, 
          { status: 404 }
        );
      }

      console.log('Chat GET API: Found session with', session.messages.length, 'messages');
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
