// File validation utilities for medical report uploads

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export const ALLOWED_FILE_TYPES = {
  'application/pdf': { extension: '.pdf', category: 'document' },
  'image/jpeg': { extension: '.jpg', category: 'image' },
  'image/jpg': { extension: '.jpg', category: 'image' },
  'image/png': { extension: '.png', category: 'image' },
  'image/gif': { extension: '.gif', category: 'image' },
  'text/plain': { extension: '.txt', category: 'text' },
  'application/msword': { extension: '.doc', category: 'document' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
    extension: '.docx', 
    category: 'document' 
  }
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_NAME_LENGTH = 255;

export function validateMedicalReportFile(file: File): FileValidationResult {
  const warnings: string[] = [];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]) {
    return {
      isValid: false,
      error: `File type "${file.type}" is not supported. Please upload PDF, image, or document files.`
    };
  }

  // Check file name length
  if (file.name.length > MAX_FILE_NAME_LENGTH) {
    return {
      isValid: false,
      error: `File name is too long. Maximum ${MAX_FILE_NAME_LENGTH} characters allowed.`
    };
  }

  // Check for potentially problematic file names
  const problematicChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (problematicChars.test(file.name)) {
    warnings.push('File name contains special characters that may cause issues.');
  }

  // Size warnings
  if (file.size < 1024) {
    warnings.push('File is very small and may not contain meaningful content.');
  } else if (file.size > 5 * 1024 * 1024) {
    warnings.push('Large file may take longer to process.');
  }

  // File type specific warnings
  const fileInfo = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
  if (fileInfo.category === 'image' && file.size > 2 * 1024 * 1024) {
    warnings.push('Large image files may have reduced OCR accuracy.');
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileCategory(fileType: string): string {
  const fileInfo = ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES];
  return fileInfo?.category || 'unknown';
}

export function generateSafeFileName(originalName: string, timestamp?: number): string {
  const ts = timestamp || Date.now();
  
  // Remove problematic characters and normalize
  const safeName = originalName
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase();
  
  // Add timestamp prefix
  return `${ts}_${safeName}`;
}

export function extractFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot !== -1 ? fileName.substring(lastDot) : '';
}

export function getMimeTypeFromExtension(extension: string): string | null {
  const extToMime: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return extToMime[extension.toLowerCase()] || null;
}
