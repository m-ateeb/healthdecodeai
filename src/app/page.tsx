
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { StatsSection } from '@/components/home/StatsSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturesSection />
      <TestimonialsSection />
      <StatsSection />
      <CTASection />
    </div>
  );
};

export default Index;
