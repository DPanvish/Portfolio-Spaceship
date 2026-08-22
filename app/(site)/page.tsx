import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import FloatingNav from '@/components/ui/FloatingNav';
import FilmGrain from '@/components/ui/FilmGrain';
import Marquee from '@/components/ui/Marquee';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Preloader from '@/components/ui/Preloader';

export default function SitePage() {
  return (
    <main>
      <Preloader />
      <FilmGrain />
      <ScrollProgress />
      <CustomCursor />
      <FloatingNav />
      
      <HeroSection />
      
      <Marquee text="CREATIVE DEVELOPER • DESIGN ENGINEER • 3D ARTIST • " speed={45} />
      
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
