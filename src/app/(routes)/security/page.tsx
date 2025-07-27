'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Server, Shield } from 'lucide-react';

export default function DataSecurity() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Data Security
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              How we protect your sensitive health information.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Lock className="w-6 h-6 mr-3 text-blue-600" />
                  Encryption & Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  All your health data is protected with military-grade encryption both in transit and at rest. We use industry-standard security protocols to ensure your information remains private and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Server className="w-6 h-6 mr-3 text-green-600" />
                  Infrastructure Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Secure cloud infrastructure with regular backups</li>
                  <li>• 24/7 monitoring and threat detection</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• Compliance with healthcare data protection standards</li>
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
