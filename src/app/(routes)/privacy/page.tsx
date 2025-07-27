'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: January 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Database className="w-6 h-6 mr-3 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Personal Information</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    We collect information you provide directly, such as your name, email address, and account preferences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Health Information</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Medical documents and reports you upload are processed to provide AI-powered insights. This information is encrypted and securely stored.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Usage Data</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    We collect information about how you use our service, including pages visited and features used.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Eye className="w-6 h-6 mr-3 text-green-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Provide AI-powered medical report analysis and insights
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Improve our AI models and service quality
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Communicate with you about your account and our services
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Ensure the security and integrity of our platform
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Lock className="w-6 h-6 mr-3 text-purple-600" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  We implement industry-standard security measures to protect your personal and health information:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• End-to-end encryption for all health data</li>
                  <li>• Secure cloud storage with regular backups</li>
                  <li>• Regular security audits and compliance checks</li>
                  <li>• Limited access controls for our team members</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="w-6 h-6 mr-3 text-blue-600" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Access your personal information</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Export your data in a portable format</li>
                  <li>• Opt out of certain communications</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="text-xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  If you have questions about this Privacy Policy or how we handle your information, please contact us at{' '}
                  <a href="mailto:privacy@healthdecodeai.com" className="text-blue-600 hover:text-blue-700">
                    privacy@healthdecodeai.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
