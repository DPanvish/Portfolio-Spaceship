'use client';

import TextScramble from '@/components/ui/TextScramble';

export interface Experience {
  id: string;
  sort_order: number;
  role: string;
  company: string;
  period: string;
  description: string;
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="section" id="experience">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          {/* Left — heading */}
          <div className="flex flex-col gap-6">
            <TextScramble text="// EXPERIENCE" className="section-label" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] reveal-up">
              Work<br />
              <span className="text-white/40">History</span>
            </h2>
            <div className="line reveal-up" />
          </div>

          {/* Right — timeline */}
          <div className="flex flex-col gap-12">
            {experiences.map((exp, i) => (
              <div 
                key={exp.id} 
                className="group relative pl-8 md:pl-10 reveal-up transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Timeline Line */}
                <div className="absolute left-[3px] top-2 bottom-[-48px] w-px bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-full h-0 bg-[color:var(--color-accent)] group-hover:h-full transition-all duration-500 ease-out origin-top" />
                </div>
                
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 w-[7px] h-[7px] rounded-full bg-white/20 border border-black group-hover:bg-[color:var(--color-accent)] group-hover:scale-150 group-hover:shadow-[0_0_10px_var(--color-accent)] transition-all duration-300 ease-out z-10" />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors duration-200">{exp.role}</h3>
                    {/* Hover Arrow */}
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className="text-[color:var(--color-accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out"
                    >
                      <path d="M6 4l4 4-4 4" />
                    </svg>
                  </div>
                  <span className="text-white/30 font-mono text-xs whitespace-nowrap mt-1 tracking-widest uppercase">
                    {exp.period}
                  </span>
                </div>
                
                <p className="text-[color:var(--color-accent)] font-mono text-sm mb-4 opacity-80">{exp.company}</p>

                <p className="text-white/40 text-sm leading-relaxed max-w-2xl group-hover:text-white/60 transition-colors duration-300">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
