'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Heart, Shield } from 'lucide-react';

export default function MedicalDisclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Medical Disclaimer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Important information about the limitations of our AI-powered health insights.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-xl font-bold text-red-800 dark:text-red-200">Important Medical Notice</h2>
              </div>
              <p className="text-red-700 dark:text-red-300">
                HealthDecodeAI is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding a medical condition.
              </p>
            </div>

            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Heart className="w-6 h-6 mr-3 text-blue-600" />
                  Nature of Our Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  HealthDecodeAI provides AI-powered analysis and interpretation of medical documents for educational and informational purposes only. Our service:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Offers general health information and insights</li>
                  <li>• Helps you understand medical terminology</li>
                  <li>• Provides medication information from public sources</li>
                  <li>• Suggests questions to ask your healthcare provider</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="w-6 h-6 mr-3 text-green-600" />
                  What We Cannot Do
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI system cannot and does not:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Provide medical diagnoses or treatment recommendations</li>
                  <li>• Replace consultation with healthcare professionals</li>
                  <li>• Guarantee accuracy of medical interpretations</li>
                  <li>• Offer emergency medical assistance</li>
                  <li>• Prescribe medications or dosages</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
