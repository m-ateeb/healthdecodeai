'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, Gavel } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using HealthDecodeAI.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: January 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing and using HealthDecodeAI, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="w-6 h-6 mr-3 text-green-600" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  HealthDecodeAI is an AI-powered platform that provides:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Medical report analysis and interpretation</li>
                  <li>• Medication information and interaction checking</li>
                  <li>• Health insights and recommendations</li>
                  <li>• Educational health content</li>
                </ul>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 dark:text-yellow-200 font-semibold">Important Medical Disclaimer:</p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    Our service is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. 
                    Always consult with qualified healthcare providers for medical decisions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Users className="w-6 h-6 mr-3 text-purple-600" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  As a user of HealthDecodeAI, you agree to:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Provide accurate and truthful information</li>
                  <li>• Use the service only for lawful purposes</li>
                  <li>• Not share your account credentials with others</li>
                  <li>• Respect the intellectual property rights of the platform</li>
                  <li>• Not attempt to reverse engineer or hack the service</li>
                  <li>• Report any security vulnerabilities responsibly</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="text-xl">Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                  use, and protect your information. By using our service, you consent to our data practices as 
                  described in our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Limitations of Liability */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Gavel className="w-6 h-6 mr-3 text-red-600" />
                  Limitations of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  HealthDecodeAI provides information and tools "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Medical decisions made based on our AI insights</li>
                  <li>• Accuracy of AI-generated interpretations</li>
                  <li>• Delays or interruptions in service</li>
                  <li>• Loss of data due to technical issues</li>
                  <li>• Indirect or consequential damages</li>
                </ul>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="text-xl">Modifications to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes 
                  via email or through our platform. Continued use of the service after changes constitutes acceptance 
                  of the modified terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="text-xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  If you have questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:legal@healthdecodeai.com" className="text-blue-600 hover:text-blue-700">
                    legal@healthdecodeai.com
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
