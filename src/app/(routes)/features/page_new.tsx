"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Brain, Heart, Shield, Zap, Users, Clock, Star, CheckCircle, ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms analyze your symptoms to provide accurate preliminary diagnoses and health insights.",
      benefits: ["99.5% accuracy rate", "Instant results", "Continuous learning"],
      color: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950"
    },
    {
      icon: Heart,
      title: "Personalized Health Plans",
      description: "Custom wellness programs tailored to your unique health profile, lifestyle, and goals.",
      benefits: ["Personalized recommendations", "Adaptive planning", "Progress tracking"],
      color: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Enterprise-grade encryption and HIPAA compliance ensure your health data stays private and secure.",
      benefits: ["End-to-end encryption", "HIPAA compliant", "Zero data sharing"],
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950"
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "24/7 health monitoring with smart alerts and recommendations based on your vital signs and activities.",
      benefits: ["Continuous monitoring", "Smart alerts", "Preventive care"],
      color: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with certified healthcare professionals and specialists through our integrated platform.",
      benefits: ["Verified professionals", "Instant consultation", "Specialist network"],
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access healthcare guidance anytime, anywhere with our round-the-clock AI assistant.",
      benefits: ["Always available", "Global access", "Instant response"],
      color: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950"
    }
  ];

  const stats = [
    { number: "99.5%", label: "Diagnostic Accuracy", icon: TrendingUp },
    { number: "1M+", label: "Users Worldwide", icon: Users },
    { number: "24/7", label: "Available Support", icon: Clock },
    { number: "50+", label: "Healthcare Awards", icon: Award }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      quote: "HealthDecodeAI has revolutionized how I approach patient care. The AI insights are incredibly accurate and save me hours of analysis.",
      image: "photo-1559839734-2b71ea197ec2",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Emergency Medicine",
      quote: "The real-time monitoring capabilities have helped us catch critical conditions early and improve patient outcomes significantly.",
      image: "photo-1582750433449-648ed127bb54",
      rating: 5
    },
    {
      name: "Dr. Lisa Thompson",
      role: "Family Medicine",
      quote: "My patients love the personalized health plans. It's made preventive care more engaging and effective than ever before.",
      image: "photo-1594824388607-359a9d17ad2f",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Advanced Animation */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{animationDelay: '2s'}}>
          <Sparkles className="w-8 h-8 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{animationDelay: '4s'}}>
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200 animate-fade-in">
              🚀 Advanced AI Technology
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Better Health Outcomes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover how our cutting-edge AI technology transforms healthcare delivery with intelligent insights and personalized care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                  Try Free Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Revolutionary Healthcare Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of healthcare with our AI-powered platform designed for optimal patient outcomes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up glass-effect border-0 bg-gradient-to-br ${feature.bgGradient} overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-green-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what leading healthcare providers say about HealthDecodeAI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in glass-effect border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={`https://images.unsplash.com/${testimonial.image}?w=80&h=80&fit=crop&crop=face`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Future of Healthcare?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of healthcare professionals who are already using HealthDecodeAI to improve patient outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
