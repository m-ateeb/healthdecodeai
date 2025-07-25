
import { ArrowRight, Upload, Shield, Brain, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="mt-16 relative py-20 lg:py-32 flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-900">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 animate-float">
        <div className="w-20 h-20 bg-blue-200 rounded-full opacity-20 dark:bg-blue-800"></div>
      </div>
      <div className="absolute top-32 right-20 animate-float" style={{animationDelay: '2s'}}>
        <div className="w-16 h-16 bg-green-200 rounded-full opacity-20 dark:bg-green-800"></div>
      </div>
      <div className="absolute bottom-20 left-20 animate-float" style={{animationDelay: '4s'}}>
        <div className="w-12 h-12 bg-purple-200 rounded-full opacity-20 dark:bg-purple-800"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200">
            🚀 Revolutionary Healthcare AI
          </Badge> */}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
            Your Personal
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Health Companion
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Transform complex medical reports into clear insights and ensure medication safety with our AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                Watch Demo
              </Button>
            </Link>
          </div>
          
          
        </div>
      </div>

      {/* ChevronDown at the bottom, outside main content to avoid overlap */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center z-20 pointer-events-none">
        <div className="animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
