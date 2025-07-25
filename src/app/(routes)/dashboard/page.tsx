
"use client";

import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Shield, 
  Brain, 
  Plus, 
  Search,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  ArrowRight,
  Download,
  Eye,
  Star,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const healthStats = [
    {
      title: "Health Score",
      value: "94",
      unit: "/100",
      icon: Heart,
      trend: "+2.3%",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
    },
    {
      title: "Reports Analyzed",
      value: "23",
      unit: " reports",
      icon: FileText,
      trend: "+12",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950"
    },
    {
      title: "Risk Factors",
      value: "2",
      unit: " detected",
      icon: AlertTriangle,
      trend: "-1",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950"
    },
    {
      title: "AI Accuracy",
      value: "99.5",
      unit: "%",
      icon: Brain,
      trend: "+0.2%",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950"
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: "Blood Test Results",
      date: "2024-01-15",
      status: "analyzed",
      type: "lab_result",
      summary: "All values within normal range",
      confidence: 98,
      priority: "low"
    },
    {
      id: 2,
      title: "Cardiology Report",
      date: "2024-01-12",
      status: "pending",
      type: "specialist_report",
      summary: "Awaiting analysis",
      confidence: null,
      priority: "medium"
    },
    {
      id: 3,
      title: "Medication Review",
      date: "2024-01-10",
      status: "analyzed",
      type: "medication",
      summary: "2 potential interactions found",
      confidence: 95,
      priority: "high"
    },
    {
      id: 4,
      title: "X-Ray Analysis",
      date: "2024-01-08",
      status: "analyzed",
      type: "imaging",
      summary: "No abnormalities detected",
      confidence: 97,
      priority: "low"
    }
  ];

  const medications = [
    { 
      name: "Metformin", 
      dosage: "500mg", 
      frequency: "2x daily", 
      status: "active",
      nextDose: "2:00 PM",
      interactions: 0
    },
    { 
      name: "Lisinopril", 
      dosage: "10mg", 
      frequency: "1x daily", 
      status: "active",
      nextDose: "8:00 AM",
      interactions: 0
    },
    { 
      name: "Aspirin", 
      dosage: "81mg", 
      frequency: "1x daily", 
      status: "active",
      nextDose: "8:00 AM",
      interactions: 1
    }
  ];

  const quickActions = [
    {
      title: "Upload New Report",
      description: "Add medical reports for AI analysis",
      icon: Upload,
      color: "from-blue-500 to-cyan-500",
      action: "upload"
    },
    {
      title: "Schedule Consultation",
      description: "Book a session with healthcare experts",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      action: "schedule"
    },
    {
      title: "Medication Check",
      description: "Verify drug interactions and safety",
      icon: Shield,
      color: "from-purple-500 to-violet-500",
      action: "medication"
    },
    {
      title: "Health Insights",
      description: "Get personalized health recommendations",
      icon: Brain,
      color: "from-orange-500 to-red-500",
      action: "insights"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{animationDelay: '2s'}}>
          <Sparkles className="w-6 h-6 text-yellow-400 opacity-30" />
        </div>
        
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Welcome back! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Here&apos;s your health overview for today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reports, medications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Health Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthStats.map((stat, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in glass-effect border-0 bg-gradient-to-br ${stat.bgColor}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.unit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-0 shadow-xl animate-slide-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">Recent Reports</CardTitle>
                    <CardDescription>Latest medical document analysis</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div 
                      key={report.id} 
                      className={`p-4 rounded-xl border-l-4 bg-white/50 dark:bg-gray-800/50 hover:shadow-md transition-all duration-200 ${getPriorityColor(report.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{report.title}</h4>
                            <Badge className={getStatusColor(report.status)} variant="secondary">
                              {report.status}
                            </Badge>
                            {report.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {report.confidence}% confidence
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{report.summary}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {report.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-effect border-0 shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium">{action.title}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card className="glass-effect border-0 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Current Medications</CardTitle>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medications.map((med, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{med.name}</h4>
                          <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency}</p>
                        </div>
                        {med.interactions > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {med.interactions} interaction
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Next: {med.nextDose}</span>
                        <Badge variant="outline" className="text-xs">
                          {med.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="glass-effect border-0 shadow-xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Today&apos;s Health Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Based on your recent reports, consider increasing your daily water intake to 8-10 glasses to support kidney function.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Learn More
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const healthMetrics = [
    { label: "Reports Analyzed", value: "24", change: "+12%", trend: "up" },
    { label: "Medications Checked", value: "8", change: "+3", trend: "up" },
    { label: "Safety Alerts", value: "2", change: "-1", trend: "down" },
    { label: "Health Score", value: "94", change: "+2", trend: "up" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Sarah!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s your health overview for today
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Upload Report</h3>
                  <p className="text-sm text-muted-foreground">Analyze new document</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Check Medications</h3>
                  <p className="text-sm text-muted-foreground">Drug interactions</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Chat</h3>
                  <p className="text-sm text-muted-foreground">Ask health questions</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Health Trends</h3>
                  <p className="text-sm text-muted-foreground">View analytics</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-scale-in">
            {healthMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-4 w-4 ${
                        metric.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span className="text-sm font-medium">{metric.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Reports */}
            <div className="lg:col-span-2">
              <Card className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Your latest medical document analyses</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">{report.summary}</p>
                            <p className="text-xs text-muted-foreground">{report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={report.status === 'analyzed' ? 'default' : 'secondary'}>
                            {report.status === 'analyzed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Medications */}
            <div>
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Current Medications</CardTitle>
                  <CardDescription>Your active prescriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medications.map((med, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{med.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {med.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Health Alerts */}
              <Card className="mt-6 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Health Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Medication Interaction
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                        Potential interaction between Metformin and new supplement
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Lab Follow-up
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        Cholesterol recheck recommended in 3 months
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
