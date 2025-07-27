
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CTASection() {
  const benefits = [
    "No setup fees or hidden costs",
    "Cancel anytime, no contracts",
    "24/7 customer support",
    "HIPAA compliant security"
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect border-0 rounded-2xl p-8 md:p-12">
            <div className="text-center animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Transform Your
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Healthcare Experience?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare professionals and patients who trust HealthDecodeAI for better health outcomes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <Image 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=400&fit=crop"
                  alt="Healthcare professional using HealthDecodeAI"
                  className="rounded-lg shadow-lg w-full h-[300px] object-cover"
                  width={500}
                  height={300}
                />
              </div>
              
              <div className="text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold mb-6">Start Your Free Trial Today</h3>
                <ul className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
