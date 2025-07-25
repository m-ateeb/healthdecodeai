
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Shield, Brain, Zap, Users, Clock } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Upload,
      title: "Smart Report Analysis",
      description: "Upload medical documents and get instant, easy-to-understand explanations powered by advanced AI.",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950"
    },
    {
      icon: Shield,
      title: "Medication Safety",
      description: "Check drug interactions and get personalized safety recommendations to protect your health.",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent health insights tailored to your unique medical history and conditions.",
      color: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Receive immediate analysis and recommendations without waiting for appointments.",
      color: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with certified healthcare professionals when you need human expertise.",
      color: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Access healthcare guidance anytime, anywhere with our round-the-clock platform.",
      color: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/50 to-green-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose HealthDecodeAI?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of healthcare with our comprehensive AI-powered platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-in glass-effect border-0 bg-gradient-to-br ${feature.bgGradient} cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
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
