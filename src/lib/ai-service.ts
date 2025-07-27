// AI Service configuration and utilities
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'mock';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  finishReason?: string;
}

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Real Gemini AI service
export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    if (!config.apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(config.apiKey);
  }

  async generateChatCompletion(
    messages: ChatCompletionMessage[],
    options?: Partial<AIConfig>
  ): Promise<AIResponse> {
    console.log('GeminiAIService: Generating chat completion');
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.config.model || 'gemini-1.5-flash',
        generationConfig: {
          temperature: options?.temperature || this.config.temperature || 0.7,
          maxOutputTokens: options?.maxTokens || this.config.maxTokens || 1000,
        }
      });

      // Combine messages into a single prompt for Gemini
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const conversationHistory = messages
        .filter(m => m.role !== 'system')
        .map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const fullPrompt = `${systemMessage}\n\n${conversationHistory}\n\nAssistant:`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Estimate token usage (Gemini doesn't provide exact counts)
      const estimatedPromptTokens = Math.ceil(fullPrompt.length / 4);
      const estimatedCompletionTokens = Math.ceil(text.length / 4);

      return {
        content: text,
        usage: {
          promptTokens: estimatedPromptTokens,
          completionTokens: estimatedCompletionTokens,
          totalTokens: estimatedPromptTokens + estimatedCompletionTokens
        },
        model: this.config.model || 'gemini-1.5-flash',
        finishReason: 'stop'
      };
    } catch (error) {
      console.error('Gemini AI error:', error);
      throw new Error(`Gemini AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeDocument(text: string, documentType?: string): Promise<AIResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.config.model || 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.3, // Lower temperature for medical analysis
          maxOutputTokens: 2000,
        }
      });

      const prompt = `${HEALTH_PROMPTS.documentAnalysis}

Document Type: ${documentType || 'Medical Report'}

Document Content:
${text}

Please provide a comprehensive analysis including:
1. **Summary**: Brief overview of the document
2. **Key Findings**: Important medical findings in simple terms
3. **Normal Values**: What results are within normal range
4. **Areas of Concern**: Any values or findings that need attention
5. **Recommendations**: Suggested next steps or follow-up actions
6. **Confidence Level**: Your confidence in this analysis (as a percentage)

Format your response in clear sections with markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text_response = response.text();

      const estimatedPromptTokens = Math.ceil(prompt.length / 4);
      const estimatedCompletionTokens = Math.ceil(text_response.length / 4);

      return {
        content: text_response,
        usage: {
          promptTokens: estimatedPromptTokens,
          completionTokens: estimatedCompletionTokens,
          totalTokens: estimatedPromptTokens + estimatedCompletionTokens
        },
        model: this.config.model || 'gemini-1.5-flash',
        finishReason: 'stop'
      };
    } catch (error) {
      console.error('Gemini document analysis error:', error);
      throw new Error(`Document analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Mock AI service for development/testing
export class MockAIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateChatCompletion(
    messages: ChatCompletionMessage[],
    options?: Partial<AIConfig>
  ): Promise<AIResponse> {
    console.log('MockAIService: Generating chat completion');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.content.toLowerCase();

    // Generate contextual responses based on user input
    let response = '';

    if (userContent.includes('blood test') || userContent.includes('lab result')) {
      response = "I've analyzed your blood test results. Here are the key findings:\n\n" +
        "• **Hemoglobin**: 14.2 g/dL (Normal range: 12.0-15.5 g/dL)\n" +
        "• **White Blood Cell Count**: 6,800/μL (Normal range: 4,500-11,000/μL)\n" +
        "• **Cholesterol**: 185 mg/dL (Normal: <200 mg/dL)\n\n" +
        "Overall, your results look good! Your hemoglobin and WBC count are within normal ranges, and your cholesterol is at a healthy level. " +
        "I recommend maintaining your current lifestyle and scheduling a follow-up in 6 months.";
    } else if (userContent.includes('medication') || userContent.includes('drug')) {
      response = "I can help you understand medication interactions and side effects. " +
        "Please share the names of the medications you're taking, and I'll check for any potential interactions. " +
        "Remember to always consult with your healthcare provider before making any changes to your medication regimen.";
    } else if (userContent.includes('symptoms') || userContent.includes('pain')) {
      response = "I understand you're experiencing some symptoms. While I can provide general health information, " +
        "it's important to consult with a healthcare professional for proper diagnosis and treatment. " +
        "Can you describe your symptoms in more detail? This will help me provide better general guidance.";
    } else if (userContent.includes('upload') || userContent.includes('report')) {
      response = "I can help analyze medical reports, lab results, and imaging studies. " +
        "You can upload documents in PDF, image, text, or Word document format, and I'll extract key information and provide insights in simple terms. " +
        "Would you like to upload a report for analysis?";
    } else if (userContent.includes('hello') || userContent.includes('hi')) {
      response = "Hello! I'm your HealthWise AI assistant. I'm here to help you understand medical reports, " +
        "check medication interactions, answer health questions, and provide general medical information. " +
        "How can I assist you today?";
    } else {
      response = "I understand your question about " + userContent + ". " +
        "Based on current medical knowledge, here's what I can tell you:\n\n" +
        "This is an area where individual circumstances matter greatly. I recommend discussing this with your healthcare provider " +
        "who can give you personalized advice based on your medical history and current health status.\n\n" +
        "Is there anything specific about this topic you'd like me to explain further?";
    }

    return {
      content: response,
      usage: {
        promptTokens: messages.reduce((acc, msg) => acc + msg.content.length / 4, 0),
        completionTokens: response.length / 4,
        totalTokens: (messages.reduce((acc, msg) => acc + msg.content.length, 0) + response.length) / 4
      },
      model: this.config.model || 'mock-gpt-4',
      finishReason: 'stop'
    };
  }

  async analyzeDocument(text: string, documentType?: string): Promise<AIResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const response = `## Medical Document Analysis

**Document Type**: ${documentType || 'Medical Report'}

### Key Findings:
• Blood pressure readings are within normal range
• No significant abnormalities detected in routine labs
• Cholesterol levels are acceptable
• Liver function tests show normal values

### Recommendations:
• Continue current medications as prescribed
• Maintain regular exercise routine
• Schedule follow-up appointment in 3 months
• Monitor blood pressure at home weekly

### Important Notes:
This analysis is for informational purposes only. Please consult with your healthcare provider for medical advice and treatment decisions.

**Confidence Level**: 85%`;

    return {
      content: response,
      usage: {
        promptTokens: text.length / 4,
        completionTokens: response.length / 4,
        totalTokens: (text.length + response.length) / 4
      },
      model: this.config.model || 'mock-gpt-4',
      finishReason: 'stop'
    };
  }
}

// Factory function to create AI service
export function createAIService(config: AIConfig) {
  console.log('Creating AI service with config:', {
    provider: config.provider,
    hasApiKey: !!config.apiKey,
    model: config.model
  });

  switch (config.provider) {
    case 'gemini':
      // Check if Gemini API key is available
      if (!config.apiKey) {
        console.warn('Gemini API key not found, falling back to mock service');
        return new MockAIService({ ...config, provider: 'mock' });
      }
      try {
        console.log('Initializing Gemini AI service...');
        const service = new GeminiAIService(config);
        console.log('Gemini AI service initialized successfully');
        return service;
      } catch (error) {
        console.warn('Failed to initialize Gemini service, falling back to mock service:', error);
        return new MockAIService({ ...config, provider: 'mock' });
      }
    case 'mock':
      console.log('Using Mock AI service');
      return new MockAIService(config);
    default:
      // Default to Gemini, but fall back to mock if no API key
      if (!config.apiKey) {
        console.warn('No API key provided, using mock service');
        return new MockAIService({ ...config, provider: 'mock' });
      }
      try {
        console.log('Initializing default Gemini AI service...');
        const service = new GeminiAIService(config);
        console.log('Default Gemini AI service initialized successfully');
        return service;
      } catch (error) {
        console.warn('Failed to initialize default AI service, falling back to mock service:', error);
        return new MockAIService({ ...config, provider: 'mock' });
      }
  }
}

// Default configuration using Gemini
export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'gemini',
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-1.5-flash',
  maxTokens: 1000,
  temperature: 0.7
};

// Health-specific prompt templates
export const HEALTH_PROMPTS = {
  system: `You are HealthWise AI, a friendly and knowledgeable health assistant. Your goal is to explain medical information in the simplest possible terms that anyone can understand, regardless of their medical background.

Core principles:
- Use everyday language, avoid medical jargon
- Explain complex concepts with simple analogies
- Break down information into easy-to-follow points
- Always emphasize consulting healthcare professionals for medical decisions
- Be empathetic, supportive, and encouraging
- Provide actionable advice when appropriate

Areas of expertise:
- Medical reports and lab results (explained in plain English)
- Medication information (uses, side effects, precautions)
- General health and wellness guidance
- Symptom information (educational, not diagnostic)

Response style:
- Use bullet points and clear sections
- Include practical tips and recommendations
- Explain "why" behind medical advice
- Use reassuring but honest language`,

  documentAnalysis: `Please analyze this medical document and explain it in the simplest possible terms that anyone can understand:

1. **What This Report Shows**: Summarize the main purpose in everyday language
2. **Key Findings**: Explain important results using simple words (avoid medical terms)
3. **What's Normal vs. Concerning**: Use easy comparisons (like "good" vs. "needs attention")
4. **What This Means for You**: Practical implications in daily life
5. **Next Steps**: Clear, actionable recommendations
6. **Questions to Ask Your Doctor**: Suggest specific questions to discuss

Format your response with clear headings and bullet points. Use analogies when helpful (e.g., "Your cholesterol is like the oil in your car's engine"). Include a confidence level and always remind them to discuss results with their healthcare provider.`,

  medicationCheck: `Please provide comprehensive medication information in the simplest possible terms:

**About This Medication:**
1. **What it does**: Explain the purpose in everyday language (e.g., "helps lower blood pressure like a water valve")
2. **How it works**: Simple explanation of the mechanism
3. **Why doctors prescribe it**: Common conditions it treats

**Taking This Medication:**
1. **How to take it**: Clear instructions (with food, time of day, etc.)
2. **What to expect**: Timeline for seeing effects
3. **What to avoid**: Foods, drinks, other medications that don't mix well

**Side Effects to Watch For:**
1. **Common side effects**: What most people might experience (explained simply)
2. **Serious side effects**: Red flags that need immediate medical attention
3. **Long-term effects**: What to monitor over time

**Important Tips:**
1. **Dos and Don'ts**: Practical daily advice
2. **When to call your doctor**: Specific situations to report
3. **Questions to ask**: Suggested questions for your healthcare provider

Use simple language throughout. Include helpful analogies and real-world examples. Always emphasize the importance of following their doctor's specific instructions and asking questions during appointments.`
};
