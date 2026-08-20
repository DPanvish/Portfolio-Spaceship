'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltCard from '@/components/ui/TiltCard';
import TextScramble from '@/components/ui/TextScramble';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: '01', title: 'Stellar Dashboard', category: 'Web App', desc: 'Real-time analytics platform with 3D data visualization and live WebSocket feeds.', bg: '#0c0c12', accent: '#00f0ff' },
  { id: '02', title: 'Nebula Commerce', category: 'E-Commerce', desc: 'High-performance storefront with immersive product experiences and AR previews.', bg: '#0a0a14', accent: '#a855f7' },
  { id: '03', title: 'Quantum Editor', category: 'SaaS Tool', desc: 'Collaborative code editor with AI-powered suggestions and real-time pair programming.', bg: '#0f0a14', accent: '#f97316' },
  { id: '04', title: 'Orbit Social', category: 'Mobile App', desc: 'Location-based social platform with AR integration and spatial audio experiences.', bg: '#0a140a', accent: '#22c55e' },
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
    <section ref={sectionRef} id="projects" className="h-screen w-full overflow-hidden relative">
      <div ref={scrollContainerRef} className="flex h-full w-max flex-nowrap items-center px-6 md:px-16 gap-10 md:gap-16 will-change-transform" style={{ transform: 'translateZ(0)' }}>

        {/* Heading Card */}
        <div className="w-[80vw] md:w-[35vw] flex-shrink-0 flex flex-col justify-center gap-6">
          <TextScramble text="// PROJECTS" className="section-label" />
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]" data-cursor="grow">
            Selected<br />
            <span className="text-white/30">Work</span>
          </h2>
          <div className="line" />
        </div>

        {/* Project Cards with 3D tilt */}
        {projects.map((project) => (
          <TiltCard key={project.id} className="flex-shrink-0 w-[80vw] md:w-[55vw] min-w-[350px]" maxTilt={6}>
            <div className="flex flex-col gap-5 group" data-cursor="grow">
              {/* Image area */}
              <div
                className="relative w-full aspect-[16/10] overflow-hidden"
                style={{ backgroundColor: project.bg }}
              >
                {/* Project number */}
                <div className="absolute top-5 left-5 font-mono text-xs text-white/15 z-10">
                  {project.id}
                </div>

                {/* Accent line at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: project.accent }}
                />

                {/* Center content placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-6xl md:text-8xl font-bold opacity-[0.03] select-none"
                    style={{ color: project.accent }}
                  >
                    {project.title.split(' ')[0]}
                  </span>
                </div>

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* "View Project" on hover */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: project.accent }}>
                    View →
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 px-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{project.title}</h3>
                  <span className="font-mono text-xs text-white/25 tracking-wider uppercase">{project.category}</span>
                </div>
                <p className="text-white/35 text-sm leading-relaxed">{project.desc}</p>
              </div>
            </div>
          </TiltCard>
        ))}

        {/* End spacer */}
        <div className="w-[10vw] flex-shrink-0" />
      </div>
    </section>
  );
}
