import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import CustomCursor from '@/components/ui/CustomCursor';
import FloatingNav from '@/components/ui/FloatingNav';

export default function SitePage() {
  return (
    <main>
      <CustomCursor />
      <FloatingNav />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
    </main>
  );
}
