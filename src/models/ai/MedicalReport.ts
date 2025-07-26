import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: ["blood_test", "x_ray", "mri", "ct_scan", "prescription", "lab_report", "other"],
    default: "other"
  },
  analysisStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending"
  },
  aiAnalysis: {
    summary: String,
    keyFindings: [String],
    recommendations: [String],
    riskFactors: [String],
    confidence: Number
  },
  extractedText: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
  analyzedAt: {
    type: Date
  }
});

const MedicalReport = mongoose.models.MedicalReport || mongoose.model("MedicalReport", medicalReportSchema);

export default MedicalReport;

export interface IMedicalReport {
  _id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  reportType: "blood_test" | "x_ray" | "mri" | "ct_scan" | "prescription" | "lab_report" | "other";
  analysisStatus: "pending" | "processing" | "completed" | "failed";
  aiAnalysis?: {
    summary?: string;
    keyFindings?: string[];
    recommendations?: string[];
    riskFactors?: string[];
    confidence?: number;
  };
  extractedText?: string;
  metadata?: Record<string, any>;
  uploadedAt: Date;
  analyzedAt?: Date;
}
