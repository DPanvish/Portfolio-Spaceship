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

import { createClient } from '@/lib/supabase/server';

export default async function SitePage() {
  const supabase = await createClient();

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  const { data: experienceData } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true });

  const { data: aboutData } = await supabase
    .from('about')
    .select('*')
    .limit(1)
    .single();

  const projects = projectsData || [];
  const experiences = experienceData || [];
  const about = aboutData || null;

  return (
    <main>
      <Preloader />
      <FilmGrain />
      <ScrollProgress />
      <CustomCursor />
      <FloatingNav />
      
      <HeroSection />
      
      <Marquee text="CREATIVE DEVELOPER • DESIGN ENGINEER • 3D ARTIST • " speed={45} />
      
      <AboutSection about={about} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
      <ContactSection />
      <Footer />
    </main>
  );
}
