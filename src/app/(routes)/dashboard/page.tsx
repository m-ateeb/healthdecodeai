'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HistoryManager } from '@/components/HistoryManager';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Upload, 
  Activity, 
  Clock, 
  AlertCircle,
  Plus,
  PillIcon,
  FileBarChart,
  TrendingUp,
  Calendar,
  Send,
  Bot,
  User,
  MessageSquare,
  History,
  Brain,
  Heart,
  X,
  CheckCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { useDashboardChat } from '@/hooks/use-dashboard-chat';
import { useReports } from '@/hooks/use-reports';

function DashboardContent() {
  const { user } = useAuth();
  const { reports, isLoading: reportsLoading, isUploading, uploadReport, deleteReport } = useReports();
  const {
    sessions,
    currentReportSession,
    currentMedicationSession,
    isLoading,
    isSending,
    error,
    createSession,
    sendMessage,
    setCurrentReportSession,
    setCurrentMedicationSession,
    getCurrentReportSession,
    getCurrentMedicationSession,
    getReportSessions,
    getMedicationSessions,
    clearError,
    loadSession
  } = useDashboardChat();
  
  // States
  const [activeTab, setActiveTab] = useState<'overview' | 'report-chat' | 'medication-chat' | 'report-history' | 'medication-history'>('overview');
  const [reportInput, setReportInput] = useState('');
  const [medInput, setMedInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll for chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions]);

  // Calculate dynamic stats
  const totalReports = reports.length;
  const analyzedReports = reports.filter(r => r.analysisStatus === 'completed').length;
  const processingReports = reports.filter(r => r.analysisStatus === 'processing').length;
  const reportSessions = getReportSessions();
  const medicationSessions = getMedicationSessions();

  // Handlers
  const [uploadProgress, setUploadProgress] = useState<{
    fileName: string;
    progress: number;
    status: string;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Show immediate feedback
        console.log(`Starting upload of ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        setUploadProgress({
          fileName: file.name,
          progress: 10,
          status: 'Uploading file...'
        });
        
        // Create a timeout for showing progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (!prev || prev.progress >= 90) return prev;
            return {
              ...prev,
              progress: prev.progress + 10,
              status: prev.progress < 30 ? 'Processing file...' : 
                     prev.progress < 60 ? 'Extracting text...' : 
                     'Analyzing with AI...'
            };
          });
        }, 2000);
        
        const result = await uploadReport(file);
        clearInterval(progressInterval);
        
        if (result) {
          console.log(`Upload successful: ${result._id}`);
          setUploadProgress({
            fileName: file.name,
            progress: 100,
            status: 'Complete!'
          });
          
          // Auto-start report analysis chat
          const sessionId = createSession('report');
          setCurrentReportSession(sessionId);
          setActiveTab('report-chat');
          await sendMessage(sessionId, `I've just uploaded a medical report: "${file.name}" (${result.reportType}). Please provide a detailed analysis of this report, explaining the findings in simple terms, highlighting any areas of concern, and providing recommendations for next steps.`);
          
          // Clear progress after 2 seconds
          setTimeout(() => setUploadProgress(null), 2000);
        } else {
          clearInterval(progressInterval);
          setUploadProgress(null);
          console.error('Upload failed: No result returned');
        }
      } catch (error) {
        setUploadProgress(null);
        console.error('Upload failed:', error);
        // Show user-friendly error
        alert('Upload failed. Please try again or check if the file format is supported (PDF, JPG, PNG, TXT, DOC, DOCX).');
      }
    }
    // Reset file input
    event.target.value = '';
  };

  const handleDeleteReport = async (reportId: string) => {
    const success = await deleteReport(reportId);
    if (success) {
      console.log(`Report ${reportId} deleted successfully`);
    }
  };

  const handleStartReportAnalysis = () => {
    const sessionId = createSession('report');
    setCurrentReportSession(sessionId);
    setActiveTab('report-chat');
  };

  const handleStartMedicationCheck = () => {
    const sessionId = createSession('medication');
    setCurrentMedicationSession(sessionId);
    setActiveTab('medication-chat');
  };

  const handleSendReportMessage = async () => {
    if (!reportInput.trim() || isSending || !currentReportSession) return;
    
    const message = reportInput.trim();
    setReportInput('');
    
    try {
      await sendMessage(currentReportSession, message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendMedMessage = async () => {
    if (!medInput.trim() || isSending || !currentMedicationSession) return;
    
    const message = medInput.trim();
    setMedInput('');
    
    try {
      await sendMessage(currentMedicationSession, message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName || 'User'}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mt-2">
                  Your AI-powered health insights dashboard
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 text-xs md:text-sm">
                  <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Healthy & Active
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 text-xs md:text-sm">
                  <Brain className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  AI Ready
                </Badge>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4 md:space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white dark:bg-gray-800 shadow-lg border-0 h-auto p-1">
              <TabsTrigger value="overview" className="flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 py-3">
                <Activity className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="report-chat" className="flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 py-3">
                <FileText className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Report Analysis</span>
                <span className="sm:hidden">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="medication-chat" className="flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 py-3">
                <PillIcon className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Medication Info</span>
                <span className="sm:hidden">Meds</span>
              </TabsTrigger>
              <TabsTrigger value="report-history" className="flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 py-3 col-span-1 md:col-span-1">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden lg:inline">Report History</span>
                <span className="lg:hidden hidden sm:inline">R. History</span>
                <span className="sm:hidden">History</span>
              </TabsTrigger>
              <TabsTrigger value="medication-history" className="flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-sm px-2 py-3 col-span-1 md:col-span-1">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden lg:inline">Med History</span>
                <span className="lg:hidden hidden sm:inline">M. History</span>
                <span className="sm:hidden">Med</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
                <Card className="glass-effect hover:shadow-lg transition-all duration-300 border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                    <FileBarChart className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{totalReports}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Medical documents uploaded
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect hover:shadow-lg transition-all duration-300 border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Analyses Complete</CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{analyzedReports}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reports successfully analyzed
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect hover:shadow-lg transition-all duration-300 border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{sessions.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total chat sessions
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect hover:shadow-lg transition-all duration-300 border-0">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Processing</CardTitle>
                    <Clock className="h-5 w-5 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{processingReports}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reports being analyzed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-scale-in">
                {/* Medical Report Analysis */}
                <Card className="glass-effect group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border-0">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Medical Report Analysis</CardTitle>
                        <CardDescription className="text-base">
                          Upload and get instant AI analysis of your medical reports in simple terms
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer block">
                        {isUploading ? (
                          <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                        ) : (
                          <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
                        )}
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                          {isUploading ? 'Uploading & analyzing...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-gray-500">
                          JPG, PNG, • Max 10MB
                        </p>
                      </Label>
                      
                      {/* Upload Progress Indicator */}
                      {uploadProgress && (
                        <div className="mt-6 w-full max-w-md mx-auto">
                          <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {uploadProgress.fileName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {uploadProgress.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{uploadProgress.status}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleStartReportAnalysis}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        size="lg"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Start Report Chat
                      </Button>
                      {/* {reportSessions.length > 0 && (
                        <Button 
                          variant="outline"
                          size="lg"
                          onClick={() => setActiveTab('report-history')}
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <History className="w-5 h-5 mr-2" />
                          History ({reportSessions.length})
                        </Button>
                      )} */}
                    </div>
                  </CardContent>
                </Card>

                {/* Medication Information */}
                <Card className="glass-effect group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border-0">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                        <PillIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Medication Information</CardTitle>
                        <CardDescription className="text-base">
                          Get detailed medication info in simple, easy-to-understand language
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 text-lg">What you'll learn:</h4>
                      <ul className="text-green-700 dark:text-green-300 space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          How the medication works (in simple terms)
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Common side effects to watch for
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Important dos and don'ts
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Questions to ask your doctor
                        </li>
                      </ul>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleStartMedicationCheck}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        size="lg"
                      >
                        <PillIcon className="w-5 h-5 mr-2" />
                        Start Medication Chat
                      </Button>
                      {/* {medicationSessions.length > 0 && (
                        <Button 
                          variant="outline"
                          size="lg"
                          onClick={() => setActiveTab('medication-history')}
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <History className="w-5 h-5 mr-2" />
                          History ({medicationSessions.length})
                        </Button>
                      )} */}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              {/* <Card className="glass-effect border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <History className="h-6 w-6 mr-3 text-gray-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest medical document analyses and conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 && sessions.length === 0 ? (
                    <div className="text-center py-12">
                      <Brain className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Ready to get started?</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Upload your first medical report or start a medication consultation to begin your AI-powered health journey
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button onClick={handleStartReportAnalysis} className="bg-blue-600 hover:bg-blue-700">
                          <FileText className="w-4 h-4 mr-2" />
                          Analyze Report
                        </Button>
                        <Button onClick={handleStartMedicationCheck} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                          <PillIcon className="w-4 h-4 mr-2" />
                          Check Medication
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Recent Chat Sessions - Both Report and Medication /}
                      {sessions.slice(0, 3).map((session) => (
                        <div key={session.sessionId} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${session.type === 'report' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
                              {session.type === 'report' ? (
                                <FileText className="h-5 w-5 text-blue-600" />
                              ) : (
                                <PillIcon className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{session.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {session.type === 'report' ? 'Report Analysis' : 'Medication Consultation'} • {format(session.updatedAt, 'MMM dd, yyyy')}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{session.messages.length} messages</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={async () => {
                              if (session.type === 'report') {
                                setCurrentReportSession(session.sessionId);
                                setActiveTab('report-chat');
                                await loadSession(session.sessionId);
                              } else {
                                setCurrentMedicationSession(session.sessionId);
                                setActiveTab('medication-chat');
                                await loadSession(session.sessionId);
                              }
                            }}
                          >
                            Open
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card> */}
            </TabsContent>

            {/* Report Analysis Chat Tab */}
            <TabsContent value="report-chat" className="space-y-4 md:space-y-6">
              <Card className="glass-effect border-0 h-[500px] md:h-[600px] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex-shrink-0 p-3 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="p-1.5 md:p-2 bg-blue-600 rounded-lg">
                        <FileText className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg md:text-xl">Medical Report Analysis</CardTitle>
                        <CardDescription className="text-sm md:text-base">
                          AI assistant specialized in analyzing medical reports
                        </CardDescription>
                      </div>
                    </div>
                    {reportSessions.length > 1 && (
                      <Button variant="outline" size="sm" className="text-xs md:text-sm">
                        <History className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">History</span> ({reportSessions.length})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                  <ScrollArea className="flex-1 p-3 md:p-6">
                    {currentReportSession && getCurrentReportSession() ? (
                      <div className="space-y-3 md:space-y-4">
                        {getCurrentReportSession()!.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                              <div className={`flex items-start space-x-2 md:space-x-3 max-w-[90%] sm:max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`p-1.5 md:p-2 rounded-full flex-shrink-0 ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                  {message.role === 'user' ? (
                                    <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
                                  ) : (
                                    <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-300" />
                                  )}
                                </div>
                                <div className={`p-3 md:p-4 rounded-lg break-words text-sm md:text-base ${
                                  message.role === 'user' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                }`}>
                                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                  <p className={`text-xs mt-1 md:mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {format(message.timestamp, 'HH:mm')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        {isSending && (
                          <div className="flex justify-start animate-fade-in">
                            <div className="flex items-start space-x-2 md:space-x-3">
                              <div className="p-1.5 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-300" />
                              </div>
                              <div className="p-3 md:p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <div className="flex items-center space-x-2">
                                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin text-blue-600" />
                                  <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Analyzing...</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center px-4">
                        <div>
                          <FileText className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                          <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Start a new report analysis</h3>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
                            Upload a medical report or ask questions about your health data
                          </p>
                          <Button onClick={handleStartReportAnalysis} className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base">
                            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            New Analysis
                          </Button>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                  
                  {currentReportSession && (
                    <div className="border-t p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Textarea
                          value={reportInput}
                          onChange={(e) => setReportInput(e.target.value)}
                          placeholder="Ask about your medical report, lab results, or upload a new document..."
                          className="flex-1 min-h-[40px] md:min-h-[50px] resize-none text-sm md:text-base"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendReportMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendReportMessage}
                          disabled={!reportInput.trim() || isSending}
                          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                          size="sm"
                        >
                          <Send className="h-3 w-3 md:h-4 md:w-4 sm:mr-0 mr-2" />
                          <span className="sm:hidden">Send</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medication Chat Tab */}
            <TabsContent value="medication-chat" className="space-y-4 md:space-y-6">
              <Card className="glass-effect border-0 h-[500px] md:h-[600px] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 flex-shrink-0 p-3 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="p-1.5 md:p-2 bg-green-600 rounded-lg">
                        <PillIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg md:text-xl">Medication Information</CardTitle>
                        <CardDescription className="text-sm md:text-base">
                          Get medication info explained in simple, understandable terms
                        </CardDescription>
                      </div>
                    </div>
                    {medicationSessions.length > 1 && (
                      <Button variant="outline" size="sm" className="text-xs md:text-sm">
                        <History className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">History</span> ({medicationSessions.length})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                  <ScrollArea className="flex-1 p-3 md:p-6">
                    {currentMedicationSession && getCurrentMedicationSession() ? (
                      <div className="space-y-3 md:space-y-4">
                        {getCurrentMedicationSession()!.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                              <div className={`flex items-start space-x-2 md:space-x-3 max-w-[90%] sm:max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`p-1.5 md:p-2 rounded-full flex-shrink-0 ${message.role === 'user' ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                  {message.role === 'user' ? (
                                    <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
                                  ) : (
                                    <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-300" />
                                  )}
                                </div>
                                <div className={`p-3 md:p-4 rounded-lg break-words text-sm md:text-base ${
                                  message.role === 'user' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                }`}>
                                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                  <p className={`text-xs mt-1 md:mt-2 ${message.role === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                                    {format(message.timestamp, 'HH:mm')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        {isSending && (
                          <div className="flex justify-start animate-fade-in">
                            <div className="flex items-start space-x-2 md:space-x-3">
                              <div className="p-1.5 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-300" />
                              </div>
                              <div className="p-3 md:p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <div className="flex items-center space-x-2">
                                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin text-green-600" />
                                  <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Researching medication...</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center px-4">
                        <div>
                          <PillIcon className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                          <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ask about medications</h3>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
                            Get detailed information about any medication in simple, easy-to-understand language
                          </p>
                          <Button onClick={handleStartMedicationCheck} className="bg-green-600 hover:bg-green-700 text-sm md:text-base">
                            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            New Consultation
                          </Button>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                  
                  {currentMedicationSession && (
                    <div className="border-t p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Textarea
                          value={medInput}
                          onChange={(e) => setMedInput(e.target.value)}
                          placeholder="Ask about any medication: side effects, interactions, dosage, what to expect..."
                          className="flex-1 min-h-[40px] md:min-h-[50px] resize-none text-sm md:text-base"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMedMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendMedMessage}
                          disabled={!medInput.trim() || isSending}
                          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                          size="sm"
                        >
                          <Send className="h-3 w-3 md:h-4 md:w-4 sm:mr-0 mr-2" />
                          <span className="sm:hidden">Send</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Report History Tab */}
            <TabsContent value="report-history" className="space-y-6">
              <HistoryManager 
                type="report" 
                onSessionSelect={async (sessionId) => {
                  setCurrentReportSession(sessionId);
                  setActiveTab('report-chat');
                  // Load the session messages
                  await loadSession(sessionId);
                }}
              />
            </TabsContent>

            {/* Medication History Tab */}
            <TabsContent value="medication-history" className="space-y-6">
              <HistoryManager 
                type="medication" 
                onSessionSelect={async (sessionId) => {
                  setCurrentMedicationSession(sessionId);
                  setActiveTab('medication-chat');
                  // Load the session messages
                  await loadSession(sessionId);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}