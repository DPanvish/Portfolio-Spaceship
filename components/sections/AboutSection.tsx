'use client';

import { useRef, useEffect, useState } from 'react';
import TextScramble from '@/components/ui/TextScramble';

const skills = ['React', 'Three.js', 'Next.js', 'TypeScript', 'Framer Motion', 'WebGL', 'GSAP', 'Node.js'];

/** Animated counter that counts up when visible */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const startTime = performance.now();

          function tick(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <p ref={ref} className="text-4xl md:text-5xl font-bold text-white tracking-tight tabular-nums font-mono">
      {count}{suffix}
    </p>
  );
}

export default function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative">
          
          {/* Subtle horizontal divider for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />

          {/* Left column */}
          <div className="flex flex-col gap-8 lg:pr-12">
            <TextScramble text="// ABOUT" className="section-label" />

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] reveal-up" data-cursor="grow">
              Frontend<br />
              <span className="text-white/30">Architect</span>
            </h2>

            <div className="line" />

            <div className="space-y-5 text-white/45 text-base md:text-lg leading-relaxed">
              <p className="reveal-up">
                I build interfaces where every detail compounds into something that feels right. 
                Performance-first, animation-aware, and obsessively crafted.
              </p>
              <p className="reveal-up">
                Bridging the gap between design engineering and technical architecture — 
                making software that people love without knowing why.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-10 lg:pl-12 lg:pt-16">
            <p className="section-label reveal-up">{"// Tech Stack"}</p>

            <div className="stagger-group flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span 
                  key={skill} 
                  className="skill-tag stagger-item cursor-default transition-transform duration-200" 
                  data-cursor="grow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Animated stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="reveal-up bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-transform duration-200 ease-out hover:-translate-y-1">
                <Counter target={5} suffix="+" />
                <p className="text-white/30 text-xs font-mono mt-2 tracking-wider uppercase">Years Exp</p>
              </div>
              <div className="reveal-up bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-transform duration-200 ease-out hover:-translate-y-1" style={{ transitionDelay: '50ms' }}>
                <Counter target={30} suffix="+" />
                <p className="text-white/30 text-xs font-mono mt-2 tracking-wider uppercase">Projects</p>
              </div>
              <div className="reveal-up bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-transform duration-200 ease-out hover:-translate-y-1" style={{ transitionDelay: '100ms' }}>
                <Counter target={15} suffix="K" />
                <p className="text-white/30 text-xs font-mono mt-2 tracking-wider uppercase">Lines/Day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .skill-tag {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 99px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-text-dim);
          will-change: transform;
        }

        @media (hover: hover) and (pointer: fine) {
          .skill-tag:hover {
            color: var(--color-text);
            background: rgba(255,255,255,0.08);
            transform: scale(1.05);
          }
        }
      `}</style>
    </section>
  );
}
