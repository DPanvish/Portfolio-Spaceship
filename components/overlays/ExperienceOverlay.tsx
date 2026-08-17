'use client';

import { useStore } from '@/store/useStore';
import { getExperience } from '@/lib/content';
import { useEffect, useState } from 'react';
import type { Experience } from '@/lib/content-types';

export default function ExperienceOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    getExperience().then(setExperiences);
  }, []);

  // Waypoint 2 (Experience) is at t = 0.4
  // Visible between 0.32 and 0.48, fully opaque at 0.4
  const center = 0.4;
  const spread = 0.08;
  const distance = Math.abs(scrollProgress - center);
  const opacity = Math.max(0, 1 - distance / spread);

  if (opacity === 0 || experiences.length === 0) return null;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-end pr-24 pointer-events-none"
      style={{ opacity }}
    >
      <div 
        className="w-full max-w-xl h-[80vh] overflow-hidden rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-md pointer-events-auto flex flex-col"
        style={{
          // Emil Kowalski principle: Never animate from scale(0). Use subtle scale + opacity.
          // Also offset Y slightly for a nice entry feel.
          transform: `scale(${0.98 + opacity * 0.02}) translateY(${(1 - opacity) * 10}px)`,
        }}
      >
        <div className="p-6 border-b border-cyan-500/20 bg-black/40">
          <p className="text-cyan-400 font-mono text-xs mb-1 tracking-widest uppercase">
            // Mission Log_
          </p>
          <h2 className="text-2xl font-bold text-white">Experience Timeline</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-[-2rem] before:w-[1px] before:bg-cyan-900 last:before:hidden"
            >
              {/* Timeline Node */}
              <div className="absolute left-[-5px] top-1.5 w-4 h-4 rounded-full border-2 border-cyan-400 bg-black shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
              
              <div 
                className="bg-cyan-950/20 border border-cyan-900/50 rounded-xl p-5 hover:bg-cyan-900/30 hover:border-cyan-500/50 hover-blur-transition"
                style={{
                  // Stagger entrance based on opacity to create a cascading effect
                  opacity: Math.max(0, Math.min(1, opacity * (1 + index * 0.5))),
                  transform: `translateX(${(1 - opacity) * (10 + index * 5)}px)`,
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <p className="text-cyan-400 font-mono text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs text-cyan-200/50 font-mono bg-cyan-950/50 px-2 py-1 rounded">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {exp.techTags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs text-cyan-100 bg-cyan-900/40 border border-cyan-800/50 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
