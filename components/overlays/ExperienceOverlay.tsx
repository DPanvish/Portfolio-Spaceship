'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

async function getExperience() {
  return [
    {
      id: '1',
      company: 'Awwwards Agency',
      role: 'Creative Developer',
      startDate: '2023',
      endDate: null,
      description: 'Building immersive 3D web experiences.'
    },
    {
      id: '2',
      company: 'Tech Startup X',
      role: 'Frontend Engineer',
      startDate: '2020',
      endDate: '2022',
      description: 'Led the development of a complex data visualization dashboard.'
    }
  ];
}

export default function ExperienceOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    getExperience().then(setExperiences);
  }, []);

  // Ship is PARKED at Portal 2 during scroll [0.50 – 0.75].
  // Fade in over [0.50 – 0.54], full opacity [0.54 – 0.71], fade out [0.71 – 0.75].
  let opacity = 0;
  if (scrollProgress >= 0.50 && scrollProgress <= 0.75) {
    if (scrollProgress < 0.54) {
      opacity = (scrollProgress - 0.50) / 0.04;
    } else if (scrollProgress > 0.71) {
      opacity = 1 - (scrollProgress - 0.71) / 0.04;
    } else {
      opacity = 1;
    }
  }

  const isVisible = opacity > 0.01;

  return (
    <div
      className="absolute inset-0 pointer-events-none flex flex-col justify-center items-end p-12 md:p-24"
      style={{
        opacity,
        zIndex: isVisible ? 10 : -1,
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl pointer-events-auto"
          >
            <div className="overlay-panel relative">
              {/* Header */}
              <div className="p-8 border-b border-white/5">
                <p className="text-fuchsia-400/80 font-mono text-xs tracking-[0.3em] uppercase mb-3">
                  {"// Experience"}
                </p>
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-white tracking-tight">
                  Timeline
                </h2>
              </div>

              {/* Timeline */}
              <div className="p-8 flex flex-col gap-6">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="relative pl-5 border-l border-white/10 hover:border-fuchsia-500/50 transition-colors duration-300"
                  >
                    <div className="absolute top-1 -left-[4px] w-[7px] h-[7px] rounded-full bg-white/20" />

                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                        <p className="text-fuchsia-400/70 font-mono text-sm">{exp.company}</p>
                      </div>
                      <span className="text-xs text-white/30 font-mono whitespace-nowrap mt-1">
                        {exp.startDate} — {exp.endDate || 'Present'}
                      </span>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
