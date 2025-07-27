
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      content: "HealthDecodeAI has revolutionized how we approach preventive healthcare. The accuracy is remarkable.",
      rating: 5,
      image: "photo-1581091226825-a6a2a5aee158",
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content: "The personalized insights helped me understand my health better than ever before.",
      rating: 5,
      image: "photo-1488590528505-98d2b5aba04b",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
    },
    {
      name: "Lisa Rodriguez",
      role: "Healthcare Admin",
      content: "Integration was seamless and our patients love the 24/7 accessibility.",
      rating: 5,
      image: "photo-1485827404703-89b55fcc595e",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"
    }
  ];

  return (
      <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our users are saying about their experience with HealthDecodeAI
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="glass-effect hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image 
                    src={`https://images.unsplash.com/${testimonial.image}?w=60&h=60&fit=crop&crop=face`}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-white/20 shadow-lg"
                    width={48}
                    height={48}
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">&quot;{testimonial.content}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
