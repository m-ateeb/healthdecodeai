// Temporarily disable tesseract.js due to worker path issues
// import { createWorker, Worker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export interface OCROptions {
  language?: string;
  psm?: number; // Page Segmentation Mode
  oem?: number; // OCR Engine Mode
}

export class OCRService {
  private static instance: OCRService;

  private constructor() {}

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  async extractTextFromImage(
    imageBuffer: Buffer, 
    options: OCROptions = {}
  ): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      const { 
        language = 'eng',
        psm = 3, // Fully automatic page segmentation
        oem = 3  // Default OCR Engine Mode
      } = options;

      console.log(`Starting OCR processing... Buffer size: ${imageBuffer.length} bytes`);

      // Optimize image before OCR if it's too large (reduce threshold to 512KB)
      let processedBuffer = imageBuffer;
      if (imageBuffer.length > 512 * 1024) { // 512KB threshold
        console.log('Large image detected, optimizing for OCR...');
        try {
          // Use sharp to resize if available, otherwise use original
          const sharp = await import('sharp').catch(() => null);
          if (sharp?.default) {
            processedBuffer = await sharp.default(imageBuffer)
              .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 85 }) // Use JPEG for better compression
              .toBuffer();
            console.log(`Image optimized: ${processedBuffer.length} bytes`);
          }
        } catch (optimizeError) {
          console.warn('Image optimization failed, using original:', optimizeError);
          processedBuffer = imageBuffer;
        }
      }

      // OCR service temporarily disabled due to tesseract.js worker path issues
      console.log('OCR service temporarily disabled - returning placeholder result');
      
      return {
        text: 'OCR (Optical Character Recognition) service is currently being updated. For now, please upload text-based documents (PDF files) instead of images. We are working to restore image text extraction functionality soon. If you have a medical report in image format, you can try converting it to PDF first.',
        confidence: 0,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('OCR extraction failed:', error);
      
      // Return a helpful message instead of throwing
      return {
        text: 'OCR service is currently experiencing issues. Please try uploading a text-based document (PDF) or contact support if this issue persists.',
        confidence: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  async extractTextFromPDF(pdfBuffer: Buffer): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      console.log('Extracting text from PDF...');
      
      // Temporarily return a placeholder message while we fix pdf-parse issues
      console.log('PDF processing temporarily disabled - returning placeholder result');
      
      return {
        text: 'PDF text extraction is currently being updated. The file has been uploaded successfully, but text extraction is temporarily unavailable. Please try uploading a text-based document or contact support for assistance.',
        confidence: 0,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      
      // Return a helpful message instead of throwing
      return {
        text: 'PDF text extraction failed. The PDF may be corrupted, password-protected, or contain non-text content. Please try uploading a different PDF file or contact support if this issue persists.',
        confidence: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  private estimatePDFConfidence(text: string, pageCount: number): number {
    let confidence = 80; // Base confidence for PDF text extraction
    
    // Adjust based on text length
    if (text.length < 100) confidence -= 20;
    else if (text.length > 1000) confidence += 10;
    
    // Adjust based on page count
    if (pageCount > 1) confidence += 5;
    
    // Check for garbled text patterns
    const garbledRatio = (text.match(/[^\w\s.,;:()[\]{}+=<>@#$&_|~`^"'\-*/%]/g) || []).length / text.length;
    if (garbledRatio > 0.1) confidence -= 20;
    
    return Math.max(Math.min(confidence, 95), 60);
  }

  private cleanExtractedText(rawText: string): string {
    return rawText
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters that might interfere
      .replace(/[^\w\s.,;:()[\]{}+=<>@#$&_|~`^"'\-*/%]/g, '')
      // Fix common OCR mistakes
      .replace(/\b0\b/g, 'O') // Zero to O in medical contexts
      .replace(/\bl\b/g, 'I') // lowercase l to I
      .replace(/\brn\b/g, 'm') // rn to m
      // Normalize spacing
      .replace(/\s*\n\s*/g, '\n')
      .replace(/\s*\.\s*/g, '. ')
      .replace(/\s*,\s*/g, ', ')
      .trim();
  }

  // Validate if the extracted text looks like medical content
  validateMedicalContent(text: string): { isValid: boolean; confidence: number; suggestions: string[] } {
    const medicalKeywords = [
      'patient', 'diagnosis', 'treatment', 'medication', 'doctor', 'hospital',
      'blood', 'pressure', 'heart', 'rate', 'temperature', 'weight', 'height',
      'lab', 'test', 'result', 'normal', 'abnormal', 'range', 'level',
      'mg/dl', 'mmol/l', 'bpm', 'mmhg', 'units', 'report', 'findings'
    ];

    const lowerText = text.toLowerCase();
    const foundKeywords = medicalKeywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length;

    const confidence = Math.min((foundKeywords / medicalKeywords.length) * 100, 100);
    const isValid = confidence > 20; // At least 20% medical keywords

    const suggestions: string[] = [];
    
    if (!isValid) {
      suggestions.push('The extracted text does not appear to contain medical information.');
      suggestions.push('Please ensure the image is clear and contains medical report content.');
    }
    
    if (text.length < 50) {
      suggestions.push('The extracted text is very short. Consider uploading a higher quality image.');
    }
    
    if (confidence < 50) {
      suggestions.push('The medical content confidence is low. You may want to manually review the extracted text.');
    }

    return {
      isValid,
      confidence,
      suggestions
    };
  }

  // Get supported file types for OCR
  getSupportedImageTypes(): string[] {
    return [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];
  }

  // Check if file type is supported for OCR
  isImageTypeSupported(mimeType: string): boolean {
    return this.getSupportedImageTypes().includes(mimeType.toLowerCase());
  }
}

// Export singleton instance
export const ocrService = OCRService.getInstance();
