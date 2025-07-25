
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Award, Users, Globe, Heart, Target, Lightbulb, Shield, Zap, CheckCircle, Star, ArrowRight, Milestone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every decision we make is guided by what's best for patient outcomes and wellbeing.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "We maintain the highest standards of data protection and medical privacy.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously pushing the boundaries of what's possible in healthcare technology.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making quality healthcare accessible to everyone, everywhere.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const team = [
    {
      name: "Dr. Emily Chen",
      role: "Chief Executive Officer",
      bio: "Former Chief Medical Officer at Johns Hopkins, leading digital health innovation for over 15 years.",
      image: "photo-1594824663954-9d17155e6c8e",
      achievements: ["15+ years experience", "Johns Hopkins alumni", "Healthcare innovator"]
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Chief Technology Officer", 
      bio: "AI researcher with PhD from Stanford, previously at Google Health and IBM Watson Health.",
      image: "photo-1612349317150-e413f6a5b16d",
      achievements: ["Stanford PhD", "Ex-Google Health", "AI Expert"]
    },
    {
      name: "Sarah Johnson",
      role: "Chief Medical Officer",
      bio: "Board-certified physician specializing in internal medicine and healthcare informatics.",
      image: "photo-1559839734-2b71ea197ec2",
      achievements: ["Board certified", "Internal medicine", "Health informatics"]
    },
    {
      name: "David Park",
      role: "Head of AI Research",
      bio: "Machine learning expert with 20+ publications in medical AI and deep learning.",
      image: "photo-1582750433449-648ed127bb54",
      achievements: ["20+ publications", "ML Expert", "Medical AI pioneer"]
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Company Founded",
      description: "Started with a vision to democratize healthcare through AI",
      icon: Target
    },
    {
      year: "2020", 
      title: "First AI Model",
      description: "Launched our first diagnostic AI with 95% accuracy",
      icon: Zap
    },
    {
      year: "2021",
      title: "FDA Approval", 
      description: "Received FDA clearance for our AI diagnostic platform",
      icon: Award
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded to 25 countries with multilingual support", 
      icon: Globe
    },
    {
      year: "2023",
      title: "1M Users",
      description: "Reached 1 million active users worldwide",
      icon: Users
    },
    {
      year: "2024",
      title: "AI Revolution",
      description: "Leading the next generation of healthcare AI technology",
      icon: Star
    },
    {
      year: "2025",
      title: "Advanced AI Platform",
      description: "Launched next-generation AI platform with 99.5% accuracy and real-time diagnostics",
      icon: Milestone
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Animated Background */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating elements - Responsive positioning */}
        <div className="absolute top-10 md:top-20 left-4 md:left-10 animate-float">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-200 rounded-full opacity-20 dark:bg-blue-800"></div>
        </div>
        <div className="absolute top-20 md:top-40 right-4 md:right-20 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-200 rounded-full opacity-20 dark:bg-green-800"></div>
        </div>
        <div className="absolute bottom-20 md:bottom-40 left-4 md:left-20 animate-float" style={{animationDelay: '4s'}}>
          <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-200 rounded-full opacity-20 dark:bg-purple-800"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200 animate-fade-in">
              🏥 Our Story
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 animate-slide-up">
              Transforming Healthcare
              <span className="py-5 block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Through AI Innovation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              We&apos;re on a mission to make quality healthcare accessible to everyone through the power of artificial intelligence and human compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                HealthDecodeAI was founded on the belief that everyone deserves access to quality healthcare, regardless of their location or circumstances. We&apos;re leveraging cutting-edge artificial intelligence to break down barriers and create a world where healthcare is truly universal.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our team of world-class physicians, AI researchers, and healthcare experts work tirelessly to develop solutions that not only advance medical science but also improve real patient outcomes every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                    Join Our Mission
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-in glass-effect rounded-2xl p-6" style={{ animationDelay: '0.2s' }}>
              <Image 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                alt="Modern healthcare technology and AI innovation"
                className="rounded-xl shadow-2xl w-full h-[400px] object-cover"
                width={600}
                height={400}
              />
              <div className="absolute inset-6 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              
              {/* Floating stats overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">99.5%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">1M+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
                  </div>
                  <div className="text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-green-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at HealthDecodeAI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in glass-effect border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center shadow-lg`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our mission to revolutionize healthcare
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full"></div>
            
            {/* Mobile timeline line - Visible on mobile only */}
            <div className="md:hidden absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full"></div>
            
            <div className="space-y-8 md:space-y-16">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`flex items-center animate-slide-up ${
                    // Desktop: alternate sides, Mobile: all left-aligned
                    index % 2 === 0 ? 'md:justify-start justify-start' : 'md:justify-end justify-start'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden w-full pl-16">
                    <Card className="glass-effect hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-900/80">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                            {milestone.icon ? (
                              <milestone.icon className="w-6 h-6 text-white" />
                            ) : (
                              <CheckCircle className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <Badge variant="secondary" className="font-mono bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200">
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className={`hidden md:block w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="glass-effect hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-900/80">
                      <CardHeader>
                        <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                            {milestone.icon ? (
                              <milestone.icon className="w-6 h-6 text-white" />
                            ) : (
                              <CheckCircle className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <Badge variant="secondary" className="font-mono bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200">
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dots */}
                  {/* Mobile dot */}
                  <div className="md:hidden absolute left-6 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full border-4 border-background shadow-xl z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Desktop dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full border-4 border-background shadow-xl z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The brilliant minds behind HealthDecodeAI&apos;s innovation
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in glass-effect border-0 overflow-hidden bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-900/90 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <Image 
                    src={`https://images.unsplash.com/${member.image}?w=300&h=300&fit=crop&crop=face`}
                    alt={member.name}
                    className="w-full h-40 md:h-48 object-cover"
                    width={300}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Professional badge overlay */}
                  <div className="absolute top-3 md:top-4 right-3 md:right-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2 px-4 md:px-6">
                  <CardTitle className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{member.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 dark:from-blue-900 dark:to-green-900 dark:text-blue-200 text-xs md:text-sm">{member.role}</Badge>
                </CardHeader>
                <CardContent className="px-4 md:px-6">
                  <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.achievements.map((achievement, i) => (
                      <Badge key={i} variant="outline" className="text-xs hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default About;