'use client';

const experiences = [
  {
    id: '1',
    role: 'Creative Developer',
    company: 'Awwwards Agency',
    period: '2023 — Present',
    description: 'Building immersive 3D web experiences with React Three Fiber and GSAP. Leading the frontend architecture for high-profile client projects.',
  },
  {
    id: '2',
    role: 'Senior Frontend Engineer',
    company: 'Tech Startup X',
    period: '2021 — 2023',
    description: 'Led the development of a complex data visualization dashboard serving 50K+ daily users. Implemented real-time WebSocket data feeds.',
  },
  {
    id: '3',
    role: 'Frontend Developer',
    company: 'Digital Studio Y',
    period: '2019 — 2021',
    description: 'Built responsive web applications and interactive marketing sites. Introduced component-driven architecture and design systems.',
  },
];

export default function ExperienceSection() {
  return (
    <section className="section" id="experience">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          {/* Left — heading */}
          <div className="flex flex-col gap-6">
            <p className="section-label reveal-up">{"// Experience"}</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] reveal-up">
              Work<br />
              <span className="text-white/40">History</span>
            </h2>
            <div className="line reveal-up" />
          </div>

          {/* Right — timeline */}
          <div className="flex flex-col gap-10">
            {experiences.map((exp) => (
              <div key={exp.id} className="timeline-item reveal-up">
                <div className="timeline-dot" />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                    <p className="text-[color:var(--color-accent)] font-mono text-sm opacity-70">{exp.company}</p>
                  </div>
                  <span className="text-white/25 font-mono text-xs whitespace-nowrap mt-1">
                    {exp.period}
                  </span>
                </div>

                <p className="text-white/40 text-sm leading-relaxed">
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
