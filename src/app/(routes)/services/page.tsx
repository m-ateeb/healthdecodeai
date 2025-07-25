
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Stethoscope, Brain, Heart, Shield, Users, Clock, Phone, Video, MessageCircle, FileText, Activity, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const Services = () => {
  const services = [
    {
      icon: Brain,
      title: "AI Diagnosis",
      description: "Advanced AI-powered symptom analysis and preliminary diagnosis with 99.5% accuracy rate.",
      features: ["Instant symptom analysis", "Preliminary diagnosis", "Risk assessment", "Treatment recommendations"],
      price: "Starting at $29/month",
      popular: false,
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
      iconColor: "from-blue-500 to-indigo-500"
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Continuous health monitoring with real-time alerts and personalized insights.",
      features: ["24/7 monitoring", "Vital sign tracking", "Health trends", "Preventive alerts"],
      price: "Starting at $49/month",
      popular: true,
      bgGradient: "from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950",
      iconColor: "from-red-500 to-pink-500"
    },
    {
      icon: Video,
      title: "Telemedicine",
      description: "Connect with certified healthcare professionals through secure video consultations.",
      features: ["Video consultations", "Prescription services", "Follow-up care", "Specialist referrals"],
      price: "Starting at $79/month",
      popular: false,
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
      iconColor: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Enterprise Solutions",
      description: "Comprehensive healthcare solutions for organizations and healthcare providers.",
      features: ["Custom integration", "Advanced analytics", "Multi-user support", "Priority support"],
      price: "Custom pricing",
      popular: false,
      bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950",
      iconColor: "from-purple-500 to-violet-500"
    }
  ];

  const consultationTypes = [
    {
      icon: Phone,
      title: "Phone Consultation",
      description: "Quick and convenient phone consultations with healthcare professionals.",
      duration: "15-30 minutes",
      price: "$39",
      bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950",
      iconColor: "from-yellow-500 to-orange-500"
    },
    {
      icon: Video,
      title: "Video Consultation",
      description: "Face-to-face video consultations for comprehensive healthcare discussions.",
      duration: "30-45 minutes",
      price: "$59",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
      iconColor: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "Chat Support",
      description: "Text-based consultations for non-urgent health questions and follow-ups.",
      duration: "24/7 availability",
      price: "$19",
      bgGradient: "from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950",
      iconColor: "from-green-500 to-teal-500"
    },
    {
      icon: FileText,
      title: "Health Report Review",
      description: "Professional review and interpretation of your medical reports and test results.",
      duration: "48-72 hours",
      price: "$49",
      bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950",
      iconColor: "from-purple-500 to-indigo-500"
    }
  ];

  const specialties = [
    { name: "Cardiology", icon: Heart, bgGradient: "from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950", iconColor: "from-red-500 to-pink-500" },
    { name: "Neurology", icon: Brain, bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950", iconColor: "from-blue-500 to-indigo-500" },
    { name: "Dermatology", icon: Shield, bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950", iconColor: "from-green-500 to-emerald-500" },
    { name: "Pediatrics", icon: Users, bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950", iconColor: "from-yellow-500 to-orange-500" },
    { name: "Orthopedics", icon: Activity, bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950", iconColor: "from-purple-500 to-violet-500" },
    { name: "Mental Health", icon: Brain, bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950", iconColor: "from-teal-500 to-cyan-500" },
    { name: "Women's Health", icon: Heart, bgGradient: "from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950", iconColor: "from-pink-500 to-rose-500" },
    { name: "Geriatrics", icon: Clock, bgGradient: "from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950", iconColor: "from-amber-500 to-yellow-500" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-4 md:left-10 animate-float">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-200 rounded-full opacity-20 dark:bg-blue-800"></div>
        </div>
        <div className="absolute top-40 right-4 md:right-20 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-200 rounded-full opacity-20 dark:bg-green-800"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200 animate-fade-in">
              🏥 Healthcare Services
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 animate-slide-up">
              Comprehensive Healthcare
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              From AI-powered diagnosis to telemedicine consultations, we provide a full spectrum of healthcare services tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-green-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Healthcare Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive range of AI-powered healthcare solutions
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in glass-effect border-0 bg-gradient-to-br ${service.bgGradient} cursor-pointer relative ${service.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r ${service.iconColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{service.title}</CardTitle>
                  <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">{service.price}</div>
                  <Button className={`w-full ${service.popular ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white' : ''}`} variant={service.popular ? "default" : "outline"}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Consultation Options
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the consultation method that works best for you
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {consultationTypes.map((type, index) => (
              <Card 
                key={index} 
                className={`text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in glass-effect border-0 bg-gradient-to-br ${type.bgGradient} cursor-pointer`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.iconColor} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{type.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Duration: {type.duration}</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{type.price}</div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white" variant="default">
                    Book Now
                    <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-green-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Medical Specialties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access specialists across various medical fields
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 lg:gap-6">
            {specialties.map((specialty, index) => (
              <Card 
                key={index} 
                className={`text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group animate-scale-in glass-effect border-0 bg-gradient-to-br ${specialty.bgGradient}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4 lg:p-6">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-r ${specialty.iconColor} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <specialty.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-xs lg:text-sm font-medium text-gray-800 dark:text-gray-200">{specialty.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting healthcare has never been easier
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center group animate-scale-in" style={{ animationDelay: '0s' }}>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Choose Service</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Select the healthcare service that best fits your needs from our comprehensive range of options</p>
              </div>
              <div className="text-center group animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Book Appointment</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Schedule your consultation at a time that works for you with our flexible booking system</p>
              </div>
              <div className="text-center group animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Get Care</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Receive personalized healthcare guidance and treatment from our expert medical professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of patients who trust HealthDecodeAI for their healthcare needs. Start your journey to better health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
