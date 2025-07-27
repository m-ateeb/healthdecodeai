"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard chat
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <MessageCircle className="h-16 w-16 text-blue-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AI-Powered Health Chat
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get instant, personalized health insights through our advanced AI chat system. 
              Analyze medical reports, get medication guidance, and receive professional health advice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="glass-effect hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-900/90">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">Medical Report Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Upload your medical reports and get instant AI-powered analysis with detailed explanations and recommendations.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ✓ PDF & Image support<br/>
                  ✓ OCR text extraction<br/>
                  ✓ Professional insights
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-800/90 dark:to-gray-900/90">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300">Medication Guidance</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get comprehensive information about medications, interactions, side effects, and usage guidelines.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ✓ Drug interactions<br/>
                  ✓ Side effect warnings<br/>
                  ✓ Dosage recommendations
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="glass-effect rounded-2xl p-8 mb-8 bg-gradient-to-r from-blue-50/80 to-green-50/80 dark:from-gray-800/80 dark:to-gray-900/80">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Ready to Start Your Health Journey?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of users who trust HealthDecodeAI for their health insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto hover:bg-blue-50 dark:hover:bg-blue-950">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2">🔒 Your health data is encrypted and secure</p>
              <p>✨ Powered by advanced AI technology</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
