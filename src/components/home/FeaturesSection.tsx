
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Shield, Brain, Zap, Users, Clock } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: "Smart Report Analysis",
      description: "Upload medical documents and get instant, easy-to-understand explanations powered by advanced AI."
    },
    {
      icon: Shield,
      title: "Medication Safety",
      description: "Check drug interactions and get personalized safety recommendations to protect your health."
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent health insights tailored to your unique medical history and conditions."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Receive immediate analysis and recommendations without waiting for appointments."
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with certified healthcare professionals when you need human expertise."
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Access healthcare guidance anytime, anywhere with our round-the-clock platform."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-lime-50 via-cyan-25 to-blue-50 dark:from-lime-950 dark:via-cyan-950 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose HealthWise AI?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of healthcare with our comprehensive AI-powered platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
