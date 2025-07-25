
import { TrendingUp, Users, Shield, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      number: "99.5%",
      label: "Accuracy Rate",
      description: "Our AI achieves medical-grade accuracy",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
      iconColor: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      number: "1M+",
      label: "Users Worldwide",
      description: "Trusted by healthcare professionals",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
      iconColor: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      number: "100%",
      label: "HIPAA Compliant",
      description: "Your data is always secure",
      bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950",
      iconColor: "from-purple-500 to-violet-500"
    },
    {
      icon: Globe,
      number: "50+",
      label: "Countries",
      description: "Global healthcare accessibility",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
      iconColor: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proven Results That Matter
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join millions of users who trust HealthDecodeAI for their healthcare needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index} 
              className={`text-center group animate-scale-in glass-effect border-0 bg-gradient-to-br ${stat.bgGradient} hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{stat.number}</div>
                <div className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{stat.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
