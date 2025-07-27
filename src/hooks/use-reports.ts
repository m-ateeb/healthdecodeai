import { useState, useEffect, useCallback } from 'react';

export interface MedicalReport {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  reportType: string;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  aiAnalysis?: {
    summary?: string;
    keyFindings?: string[];
    recommendations?: string[];
    riskFactors?: string[];
    confidence?: number;
  };
  uploadedAt: Date;
  analyzedAt?: Date;
}

export interface UseReportsReturn {
  reports: MedicalReport[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  uploadReport: (file: File, reportType?: string) => Promise<MedicalReport | null>;
  loadReports: () => Promise<void>;
  getReport: (id: string) => Promise<MedicalReport | null>;
  deleteReport: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all reports
  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/ai/reports');
      
      if (!response.ok) {
        throw new Error('Failed to load reports');
      }

      const data = await response.json();
      if (data.success) {
        setReports(data.reports.map((report: any) => ({
          ...report,
          uploadedAt: new Date(report.uploadedAt),
          analyzedAt: report.analyzedAt ? new Date(report.analyzedAt) : undefined
        })));
      } else {
        throw new Error(data.error || 'Failed to load reports');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get specific report
  const getReport = useCallback(async (id: string): Promise<MedicalReport | null> => {
    try {
      const response = await fetch(`/api/ai/reports?id=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load report');
      }

      const data = await response.json();
      if (data.success) {
        return {
          ...data.report,
          uploadedAt: new Date(data.report.uploadedAt),
          analyzedAt: data.report.analyzedAt ? new Date(data.report.analyzedAt) : undefined
        };
      } else {
        throw new Error(data.error || 'Failed to load report');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
      return null;
    }
  }, []);

  // Upload new report
  const uploadReport = useCallback(async (file: File, reportType = 'other'): Promise<MedicalReport | null> => {
    try {
      setIsUploading(true);
      setError(null);

      // Validate file
      if (!file) {
        throw new Error('No file selected');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 10MB');
      }

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
        throw new Error('Unsupported file type. Please upload PDF, image, or text files.');
      }

      console.log(`Uploading ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportType', reportType);

      // Upload file
      const response = await fetch('/api/ai/reports', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload report');
      }

      const data = await response.json();
      if (data.success) {
        const newReport: MedicalReport = {
          ...data.report,
          uploadedAt: new Date(data.report.uploadedAt),
          analyzedAt: data.report.analyzedAt ? new Date(data.report.analyzedAt) : undefined
        };

        console.log(`Report uploaded successfully: ${newReport._id}`);
        console.log(`Analysis status: ${newReport.analysisStatus}`);

        // Add to reports list only if not already present
        setReports(prev => {
          const exists = prev.some(report => report._id === newReport._id);
          if (exists) {
            // Update existing report
            return prev.map(report => 
              report._id === newReport._id ? newReport : report
            );
          } else {
            // Add new report
            return [newReport, ...prev];
          }
        });
        return newReport;
      } else {
        throw new Error(data.error || 'Failed to upload report');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload report');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Delete report
  const deleteReport = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/ai/reports?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete report');
      }

      const data = await response.json();
      if (data.success) {
        // Remove from state
        setReports(prev => prev.filter(report => report._id !== id));
        console.log(`Report ${id} deleted successfully`);
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete report');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete report');
      return false;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, []); // Remove loadReports from deps to prevent unnecessary re-runs

  return {
    reports,
    isLoading,
    isUploading,
    error,
    uploadReport,
    loadReports,
    getReport,
    deleteReport,
    clearError
  };
}
