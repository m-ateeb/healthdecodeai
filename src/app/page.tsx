
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { StatsSection } from '@/components/home/StatsSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
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
