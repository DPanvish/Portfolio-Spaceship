'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltCard from '@/components/ui/TiltCard';
import TextScramble from '@/components/ui/TextScramble';

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: string;
  sort_order: number;
  title: string;
  category: string;
  description: string;
  bg_color: string;
  accent_color: string;
  link_url?: string;
  image_url?: string;
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
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
          <TiltCard key={project.id} className="flex-shrink-0 w-[80vw] md:w-[55vw] min-w-[350px]" maxTilt={4}>
            <div 
              className="flex flex-col gap-5 group cursor-pointer" 
              data-cursor="grow"
              style={{ '--project-accent': project.accent_color } as React.CSSProperties}
            >
              {/* Image area */}
              <div
                className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-white/5 transition-all duration-300 ease-out project-card-img"
                style={{ backgroundColor: project.bg_color }}
              >
                {/* Project number */}
                <div className="absolute top-5 left-5 font-mono text-xs text-white/30 z-10">
                  {String(project.sort_order).padStart(2, '0')}
                </div>

                {/* Accent border overlay */}
                <div 
                  className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--project-accent)] opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300 ease-out pointer-events-none z-20" 
                />

                {/* Center content placeholder or Image */}
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105">
                  {project.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span
                      className="text-6xl md:text-8xl font-bold opacity-[0.05] group-hover:opacity-[0.08] select-none transition-opacity duration-300"
                      style={{ color: project.accent_color }}
                    >
                      {project.title.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                {/* "View Project" on hover */}
                <div className="absolute bottom-5 right-5 flex items-center gap-2 z-10 overflow-hidden">
                  <span 
                    className="font-mono text-xs tracking-widest uppercase translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out" 
                    style={{ color: project.accent_color, transitionDelay: '50ms' }}
                  >
                    View Project
                  </span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    className="text-[var(--project-accent)] -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                  >
                    <path d="M4 8h8M8 4l4 4-4 4" />
                  </svg>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white/90 group-hover:text-white transition-colors duration-200">{project.title}</h3>
                  <span className="font-mono text-[10px] md:text-xs text-white/30 tracking-wider uppercase">{project.category}</span>
                </div>
                <p className="text-white/40 text-sm md:text-base leading-relaxed">{project.description}</p>
              </div>
            </div>
          </TiltCard>
        ))}

        {/* End spacer */}
        <div className="w-[10vw] flex-shrink-0" />
      </div>

      <style jsx>{`
        @media (hover: hover) and (pointer: fine) {
          .project-card-img:hover {
            box-shadow: 0 0 40px -10px var(--project-accent);
          }
          
          .group:active .project-card-img {
            transform: scale(0.98);
          }
        }
      `}</style>
    </section>
  );
}
