import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import MedicalReport from '@/models/ai/MedicalReport';
import { createAIService, DEFAULT_AI_CONFIG, HEALTH_PROMPTS } from '@/lib/ai-service';
import { validateMedicalReportFile } from '@/lib/file-validation';
import axios from 'axios';

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
    return decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

async function extractTextFromFile(buffer: Buffer, fileType: string, fileName: string): Promise<string> {
  try {
    console.log(`Extracting text from ${fileName} (${fileType})`);

    // Handle different file types
    if (fileType.includes('text') || fileName.endsWith('.txt')) {
      return buffer.toString('utf-8');
    }
    
    // Handle images with OCR Space API
    if (fileType.includes('image/')) {
      console.log('Processing image with OCR Space API...');
      try {
        // Check if OCR Space API key is configured
        if (!process.env.OCR_SPACE_API_KEY) {
          throw new Error('OCR Space API key not configured');
        }

        // Create form data for OCR Space API
        const formData = new FormData();
        formData.append('apikey', process.env.OCR_SPACE_API_KEY);
        formData.append('language', 'eng');
        formData.append('file', new Blob([buffer], { type: fileType }), fileName);

        console.log('Sending request to OCR Space API...');
        
        // Send request to OCR Space API
        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        });

        console.log('Received response from OCR Space API');

        if (response.data.IsErroredOnProcessing) {
          throw new Error(`OCR processing failed: ${response.data.ErrorMessage}`);
        }

        const parsedResults = response.data.ParsedResults;
        if (!parsedResults || parsedResults.length === 0) {
          throw new Error('No text detected in image. Please ensure the image contains clear, readable text.');
        }

        // Extract text from all pages
        const extractedText = parsedResults
          .map((result: any) => result.ParsedText || '')
          .join('\n')
          .trim();

        if (extractedText.length < 20) {
          throw new Error('Very little text extracted from image. Please ensure the image is clear and contains readable text.');
        }

        console.log(`OCR Space API completed: ${extractedText.length} characters extracted`);
        return extractedText;

      } catch (ocrError) {
        console.error('OCR Space API processing failed:', ocrError);
        throw new Error(`Failed to extract text from image: ${ocrError instanceof Error ? ocrError.message : 'OCR processing failed'}`);
      }
    }
    
    // Handle PDFs
    if (fileType === 'application/pdf') {
      console.log('Processing PDF...');
      try {
        // Use pdf-parse for PDF text extraction
        const pdfParse = await import('pdf-parse').catch(() => null);
        if (!pdfParse?.default) {
          throw new Error('PDF parsing library not available');
        }

        const data = await pdfParse.default(buffer);
        const extractedText = data.text.trim();

        if (extractedText.length < 20) {
          throw new Error('Very little text extracted from PDF. Please ensure the PDF contains readable text.');
        }

        console.log(`PDF extraction completed: ${extractedText.length} characters from ${data.numpages} pages`);
        return extractedText;

      } catch (pdfError) {
        console.error('PDF text extraction failed:', pdfError);
        throw new Error(`Failed to extract text from PDF: ${pdfError instanceof Error ? pdfError.message : 'PDF processing failed'}`);
      }
    }

    // Handle Word documents (basic text extraction)
    if (fileType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      console.log('Processing Word document...');
      // For now, return a placeholder - you can implement proper Word document parsing later
      return 'Word document processing is not yet implemented. Please convert to PDF or text format.';
    }

    throw new Error(`Unsupported file type: ${fileType}`);
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw error;
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

    // Convert file to buffer for processing
    const buffer = Buffer.from(await file.arrayBuffer());

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

    // Generate unique filename for reference (not stored locally)
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;

    // Create medical report record (without local file storage)
    const medicalReport = new MedicalReport({
      userId,
      fileName,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      filePath: '', // No local file path - file is processed in memory
      reportType,
      extractedText,
      analysisStatus: 'processing'
    });

    await medicalReport.save();
    console.log('Medical report saved to database');

    // Perform AI analysis
    try {
      console.log('Starting AI analysis...');
      const aiService = createAIService(DEFAULT_AI_CONFIG);
      
      const aiResponse = await aiService.analyzeDocument(extractedText, reportType);
      const content = aiResponse.content;

      // Parse AI response to extract structured information
      const keyFindings: string[] = [];
      const recommendations: string[] = [];
      const riskFactors: string[] = [];
      let confidence = 85; // Default confidence

      // Extract key findings
      const findingsMatch = content.match(/Key Findings?:(.*?)(?=Recommendations?|Risk Factors?|$)/is);
      if (findingsMatch) {
        const findings = findingsMatch[1]
          .split(/[•\-\*]\s*/)
          .map(f => f.trim())
          .filter(f => f.length > 0 && !f.match(/^\d+\./));
        keyFindings.push(...findings.slice(0, 5)); // Limit to 5 key findings
      }

      // Extract recommendations
      const recMatch = content.match(/Recommendations?:(.*?)(?=Risk Factors?|$)/is);
      if (recMatch) {
        const recs = recMatch[1]
          .split(/[•\-\*]\s*/)
          .map(r => r.trim())
          .filter(r => r.length > 0 && !r.match(/^\d+\./));
        recommendations.push(...recs.slice(0, 5)); // Limit to 5 recommendations
      }

      // Extract risk factors
      const riskMatch = content.match(/Risk Factors?:(.*?)(?=\n\n|$)/is);
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
    console.error('Reports API error:', error);
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

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' }, 
        { status: 400 }
      );
    }

    // Find and delete the report (only if it belongs to the user)
    const report = await MedicalReport.findOneAndDelete({ 
      _id: reportId, 
      userId 
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found or access denied' }, 
        { status: 404 }
      );
    }

    console.log(`Report ${reportId} deleted successfully for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully',
      reportId
    });

  } catch (error) {
    console.error('Reports DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
