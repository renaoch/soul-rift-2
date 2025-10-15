import Hero from '@/components/ModelViewer/index';
import FeaturedArtists from '@/components/landing/FeaturedArtists';
import HowItWorks from '@/components/landing/HowItWorks';
import TrendingDesigns from '@/components/landing/TrendingDesigns';
import BecomeCreator from '@/components/landing/BecomeCreator';
import Stats from '@/components/landing/Stats';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import ModelViewer from '@/components/ModelViewer';

export default function Home() {
  return (
    <main className="w-full bg-black">
      {/* Hero with 3D Viewer */}
      <ModelViewer />
      
      {/* Stats */}
      <Stats />
      
      {/* Trending Designs */}
      <TrendingDesigns />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Featured Artists */}
      <FeaturedArtists />
      
      {/* Become Creator CTA */}
      <BecomeCreator />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
