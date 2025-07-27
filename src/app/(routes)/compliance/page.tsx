'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, CheckCircle } from 'lucide-react';

export default function Compliance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Compliance & Standards
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our commitment to healthcare compliance and industry standards.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  Healthcare Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  HealthDecodeAI is designed with healthcare compliance in mind, following industry best practices for handling sensitive medical information.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-100 text-green-800">GDPR</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Data Protection Regulation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-800">SOC 2</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Security Standards</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-purple-100 text-purple-800">ISO 27001</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Information Security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-red-100 text-red-800">CCPA</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300">California Privacy Act</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
