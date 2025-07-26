import { NextRequest, NextResponse } from 'next/server';
import { createAIService, DEFAULT_AI_CONFIG } from '@/lib/ai-service';

export async function GET() {
  try {
    // Test the AI service
    const aiService = createAIService(DEFAULT_AI_CONFIG);
    
    const testResponse = await aiService.generateChatCompletion([
      { role: 'system', content: 'You are a helpful health AI assistant.' },
      { role: 'user', content: 'Hello, how can you help me?' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'AI service is working correctly',
      testResponse: {
        content: testResponse.content.substring(0, 100) + '...',
        model: testResponse.model,
        usage: testResponse.usage
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI service test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'AI service test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const aiService = createAIService(DEFAULT_AI_CONFIG);
    
    const response = await aiService.generateChatCompletion([
      { role: 'system', content: 'You are a helpful health AI assistant.' },
      { role: 'user', content: message }
    ]);

    return NextResponse.json({
      success: true,
      response: response.content,
      usage: response.usage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI test chat failed:', error);
    return NextResponse.json({
      success: false,
      error: 'AI chat test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
