import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import MedicalReport from '@/models/ai/MedicalReport';
import { createAIService, DEFAULT_AI_CONFIG, HEALTH_PROMPTS } from '@/lib/ai-service';
import { ocrService } from '@/lib/ocr-service';
import { validateMedicalReportFile } from '@/lib/file-validation';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface JWTPayload {
  userId: string;
  email: string;
}

async function ensureUploadsDirectory() {
  const uploadsDir = join(process.cwd(), 'uploads');
  const medicalReportsDir = join(uploadsDir, 'medical-reports');

  try {
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    if (!existsSync(medicalReportsDir)) {
      await mkdir(medicalReportsDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating upload directories:', error);
    throw error;
  }
}

async function saveUploadedFile(file: File, userId: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${userId}_${timestamp}_${sanitizedFileName}`;
  const uploadsDir = join(process.cwd(), 'uploads', 'medical-reports');
  const filePath = join(uploadsDir, fileName);

  await writeFile(filePath, buffer);
  return filePath;
}

async function verifyToken(request: NextRequest): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('Reports API Token verification:', {
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    if (!token) {
      console.log('No token found in cookies');
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    console.log('Reports API Token decoded successfully:', {
      userId: decoded.userId,
      email: decoded.email
    });
    return decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Extract text from different file types
async function extractTextFromFile(buffer: Buffer, fileType: string, fileName: string): Promise<string> {
  try {
    console.log(`Extracting text from ${fileName} (${fileType})`);

    // Handle different file types
    if (fileType.includes('text') || fileName.endsWith('.txt')) {
      return buffer.toString('utf-8');
    }
    
    // Handle images with OCR
    if (ocrService.isImageTypeSupported(fileType)) {
      console.log('Processing image with OCR...');
      try {
        const ocrResult = await ocrService.extractTextFromImage(buffer);
        
        // Validate if the content looks medical
        const validation = ocrService.validateMedicalContent(ocrResult.text);
        
        console.log(`OCR completed: ${ocrResult.confidence}% confidence, Medical validation: ${validation.confidence}%`);
        
        if (!validation.isValid) {
          console.warn('OCR result may not contain medical information:', validation.suggestions);
        }
        
        if (ocrResult.text.length < 20) {
          throw new Error('Very little text extracted from image. Please ensure the image is clear and contains readable text.');
        }
        
        return ocrResult.text;
      } catch (ocrError) {
        console.error('OCR processing failed:', ocrError);
        throw new Error(`Failed to extract text from image: ${ocrError instanceof Error ? ocrError.message : 'OCR processing failed'}`);
      }
    }
    
    // Handle PDFs
    if (fileType === 'application/pdf') {
      console.log('Processing PDF...');
      const pdfResult = await ocrService.extractTextFromPDF(buffer);
      return pdfResult.text;
    }
    
    // Handle other document types (Word, etc.)
    if (fileType.includes('document') || fileType.includes('msword')) {
      // For now, return a placeholder - in production you'd use a library like mammoth
      return `Document content from ${fileName}:\n\nThis document contains medical information that requires proper text extraction. Please ensure the document is in a supported format for full analysis.`;
    }
    
    // Fallback for unsupported types
    return `Content from ${fileName}:\n\nUnsupported file type for text extraction. Please upload the document as PDF, image, or text file for full analysis.`;
    
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Reports API: Starting POST request...');
    await connectDB();
    console.log('Reports API: Database connected');
    
    const userId = await verifyToken(request);
    console.log('Reports API: User ID:', userId);
    if (!userId) {
      console.log('Reports API: Unauthorized - no user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const reportType = formData.get('reportType') as string || 'other';
    
    console.log('Reports API: Form data received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      reportType
    });

    if (!file) {
      console.log('Reports API: No file provided');
      return NextResponse.json(
        { error: 'No file provided' }, 
        { status: 400 }
      );
    }

    // Validate file before processing
    const validation = validateMedicalReportFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid file' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' }, 
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' }, 
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'medical-reports');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Extract text from file
    console.log('Starting text extraction...');
    const extractionStart = Date.now();
    const extractedText = await extractTextFromFile(buffer, file.type, file.name);
    console.log(`Text extraction completed in ${Date.now() - extractionStart}ms`);

    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract meaningful text from the uploaded file. Please ensure the file contains readable text or try a different format.' }, 
        { status: 400 }
      );
    }

    // Create medical report record
    const medicalReport = new MedicalReport({
      userId,
      fileName,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      filePath: filePath,
      reportType,
      extractedText,
      analysisStatus: 'processing'
    });

    await medicalReport.save();

    // Analyze document with AI
    try {
      console.log('Starting AI analysis...');
      const aiService = createAIService(DEFAULT_AI_CONFIG);
      const analysis = await aiService.analyzeDocument(extractedText, reportType);

      console.log('AI analysis completed successfully');

      // Parse AI response to extract structured data
      const content = analysis.content;
      
      // Extract confidence level from the response
      const confidenceMatch = content.match(/confidence[:\s]*(\d+)%/i);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 85;

      // Extract key findings (look for bullet points or numbered lists)
      const keyFindings: string[] = [];
      const findingsMatch = content.match(/key findings?[:\s]*\n?([\s\S]*?)(?=\n##|\n\*\*|$)/i);
      if (findingsMatch) {
        const findings = findingsMatch[1]
          .split(/[•\-\*]\s*/)
          .map(f => f.trim())
          .filter(f => f.length > 0 && !f.match(/^\d+\./));
        keyFindings.push(...findings.slice(0, 5)); // Limit to 5 findings
      }

      // Extract recommendations
      const recommendations: string[] = [];
      const recMatch = content.match(/recommendations?[:\s]*\n?([\s\S]*?)(?=\n##|\n\*\*|$)/i);
      if (recMatch) {
        const recs = recMatch[1]
          .split(/[•\-\*]\s*/)
          .map(r => r.trim())
          .filter(r => r.length > 0 && !r.match(/^\d+\./));
        recommendations.push(...recs.slice(0, 5)); // Limit to 5 recommendations
      }

      // Extract risk factors
      const riskFactors: string[] = [];
      const riskMatch = content.match(/(?:risk factors?|concerns?|areas of concern)[:\s]*\n?([\s\S]*?)(?=\n##|\n\*\*|$)/i);
      if (riskMatch) {
        const risks = riskMatch[1]
          .split(/[•\-\*]\s*/)
          .map(r => r.trim())
          .filter(r => r.length > 0 && !r.match(/^\d+\./));
        riskFactors.push(...risks.slice(0, 3)); // Limit to 3 risk factors
      }

      const aiAnalysis = {
        summary: content,
        keyFindings,
        recommendations,
        riskFactors,
        confidence: Math.min(Math.max(confidence, 60), 99) // Ensure confidence is between 60-99%
      };

      // Update the report with analysis
      medicalReport.aiAnalysis = aiAnalysis;
      medicalReport.analysisStatus = 'completed';
      medicalReport.analyzedAt = new Date();
      await medicalReport.save();

      console.log('Report analysis saved successfully');

    } catch (analysisError) {
      console.error('AI analysis failed:', analysisError);
      medicalReport.analysisStatus = 'failed';
      await medicalReport.save();
      
      // Don't throw error here, still return the uploaded file info
      console.log('Continuing despite analysis failure...');
    }

    return NextResponse.json({
      success: true,
      report: {
        _id: medicalReport._id,
        fileName: medicalReport.fileName,
        originalName: medicalReport.originalName,
        fileType: medicalReport.fileType,
        fileSize: medicalReport.fileSize,
        reportType: medicalReport.reportType,
        analysisStatus: medicalReport.analysisStatus,
        aiAnalysis: medicalReport.aiAnalysis,
        uploadedAt: medicalReport.uploadedAt,
        analyzedAt: medicalReport.analyzedAt
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
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
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');

    if (reportId) {
      // Get specific report
      const report = await MedicalReport.findOne({ _id: reportId, userId });
      
      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' }, 
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        report
      });
    } else {
      // Get all reports for user
      const reports = await MedicalReport.find({ userId })
        .select('-extractedText -filePath')
        .sort({ uploadedAt: -1 })
        .limit(50);

      return NextResponse.json({
        success: true,
        reports
      });
    }

  } catch (error) {
    console.error('Reports GET API error:', error);
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
