'use client';

const skills = ['React', 'Three.js', 'Next.js', 'TypeScript', 'Framer Motion', 'WebGL', 'GSAP', 'Node.js'];

export default function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <p className="section-label reveal-up">{"// About"}</p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] reveal-up">
              Frontend<br />
              <span className="text-white/40">Architect</span>
            </h2>

            <div className="line reveal-up" />

            <div className="space-y-5 text-white/50 text-base md:text-lg leading-relaxed">
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

          {/* Right column — Skills */}
          <div className="flex flex-col gap-8 lg:pt-16">
            <p className="section-label reveal-up">{"// Tech Stack"}</p>

            <div className="stagger-group flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span key={skill} className="skill-tag stagger-item cursor-default">
                  {skill}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="reveal-up">
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">5+</p>
                <p className="text-white/30 text-sm font-mono mt-1">Years</p>
              </div>
              <div className="reveal-up">
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">30+</p>
                <p className="text-white/30 text-sm font-mono mt-1">Projects</p>
              </div>
              <div className="reveal-up">
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">∞</p>
                <p className="text-white/30 text-sm font-mono mt-1">Curiosity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
