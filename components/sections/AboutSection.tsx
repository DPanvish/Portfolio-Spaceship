'use client';

import { useRef, useEffect, useState } from 'react';

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
    <p ref={ref} className="text-4xl md:text-5xl font-bold text-white tracking-tight tabular-nums">
      {count}{suffix}
    </p>
  );
}

export default function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <p className="section-label reveal-up">{"// About"}</p>

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
          <div className="flex flex-col gap-10 lg:pt-16">
            <p className="section-label reveal-up">{"// Tech Stack"}</p>

            <div className="stagger-group flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span key={skill} className="skill-tag stagger-item cursor-default" data-cursor="grow">
                  {skill}
                </span>
              ))}
            </div>

            {/* Animated stats */}
            <div className="grid grid-cols-3 gap-8 mt-8">
              <div className="reveal-up">
                <Counter target={5} suffix="+" />
                <p className="text-white/25 text-xs font-mono mt-2 tracking-wider uppercase">Years Exp</p>
              </div>
              <div className="reveal-up">
                <Counter target={30} suffix="+" />
                <p className="text-white/25 text-xs font-mono mt-2 tracking-wider uppercase">Projects</p>
              </div>
              <div className="reveal-up">
                <Counter target={15} suffix="K" />
                <p className="text-white/25 text-xs font-mono mt-2 tracking-wider uppercase">Lines/Day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
