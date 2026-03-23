import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import CoursesSection from '@/components/home/CoursesSection';
import ValuesSection from '@/components/home/ValuesSection';
import CTASection from '@/components/home/CTASection';
import SectionDivider from '@/components/SectionDivider';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <CoursesSection />
      <SectionDivider />
      <ValuesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
