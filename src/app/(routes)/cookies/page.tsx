'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, Eye, Trash2 } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Learn about how we use cookies to improve your experience.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Cookie className="w-6 h-6 mr-3 text-blue-600" />
                  What Are Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving our services.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Settings className="w-6 h-6 mr-3 text-green-600" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Essential Cookies</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Required for the website to function properly, including authentication and security.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Analytics Cookies</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Help us understand how visitors interact with our website to improve user experience.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Preference Cookies</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Remember your settings and preferences for a personalized experience.</p>
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
