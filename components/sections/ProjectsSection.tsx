'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: '01', title: 'Stellar Dashboard', category: 'Web App', desc: 'Real-time analytics platform with 3D data visualization', bg: '#111' },
  { id: '02', title: 'Nebula Commerce', category: 'E-Commerce', desc: 'High-performance storefront with immersive product experiences', bg: '#0a0a14' },
  { id: '03', title: 'Quantum Editor', category: 'SaaS Tool', desc: 'Collaborative code editor with AI-powered suggestions', bg: '#0f0a14' },
  { id: '04', title: 'Orbit Social', category: 'Mobile App', desc: 'Location-based social platform with AR integration', bg: '#0a140a' },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!scrollContainerRef.current || !sectionRef.current) return;
      
      gsap.to(scrollContainerRef.current, {
        x: () => -(scrollContainerRef.current!.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollContainerRef.current!.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="h-screen w-full overflow-hidden bg-black text-white relative">
      <div ref={scrollContainerRef} className="flex h-full w-max flex-nowrap items-center px-10 gap-20">
        
        {/* Heading Card */}
        <div className="w-[80vw] md:w-[40vw] flex-shrink-0 flex flex-col justify-center gap-6 pr-10">
          <div className="font-mono text-sm text-white/50 uppercase tracking-widest">
            // Projects
          </div>
          <h2 
            className="text-5xl md:text-7xl font-bold leading-tight" 
            dangerouslySetInnerHTML={{ __html: 'Selected<br/>Work' }} 
          />
          <div className="line h-[1px] w-full bg-white/20 mt-4"></div>
        </div>

        {/* Project Cards */}
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="flex-shrink-0 w-[85vw] md:w-[60vw] min-w-[400px] flex flex-col gap-6 group transition-transform duration-500 ease-out [@media(hover:hover)]:hover:scale-[1.02]"
          >
            <div 
              className="relative w-full aspect-video rounded-xl overflow-hidden"
              style={{ backgroundColor: project.bg }}
            >
              <div className="absolute top-4 left-4 font-mono text-xs text-white/20 z-10">
                {project.id}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 z-0"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <span className="font-mono text-sm text-white/30">{project.category}</span>
              </div>
              <p className="text-white/40 text-sm">{project.desc}</p>
            </div>
          </div>
        ))}
        
        {/* Spacer at end to ensure the last card can scroll into full view */}
        <div className="w-[10vw] flex-shrink-0"></div>
      </div>
    </section>
  );
}
