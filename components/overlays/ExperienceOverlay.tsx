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

  // Portal 2 (Experience) threshold is at t = 0.50
  // Center is at 0.55, spread 0.05
  const center = 0.55;
  const spread = 0.05;
  const distance = Math.abs(scrollProgress - center);
  const opacity = Math.max(0, 1 - distance / spread);

  if (opacity === 0 || experiences.length === 0) return null;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-end pr-24 pointer-events-none"
      style={{ opacity }}
    >
      <div 
        className="relative w-full max-w-xl h-[80vh] overflow-hidden hud-container scanline border border-cyan-500/50 bg-black/60 backdrop-blur-xl pointer-events-auto flex flex-col shadow-[0_0_80px_rgba(0,240,255,0.15)]"
        style={{
          transform: `scale(${0.98 + opacity * 0.02}) translateY(${(1 - opacity) * 10}px)`,
        }}
      >
        <div className="relative z-10 p-6 border-b border-cyan-500/30 bg-black/40">
          <p className="text-cyan-400 font-mono text-xs mb-1 tracking-[0.2em] uppercase blinking-cursor">
            {"// Mission Log"}
          </p>
          <h2 className="text-2xl font-mono font-bold text-white uppercase tracking-widest">Experience Timeline</h2>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className="relative pl-10 before:absolute before:left-3 before:top-4 before:bottom-[-2rem] before:w-[1px] before:bg-cyan-900 last:before:hidden"
            >
              {/* Timeline Node - Crosshair */}
              <div className="absolute left-[-1px] top-3 text-cyan-400">
                <div className="w-2 h-2 border border-cyan-400 bg-black shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
              </div>
              
              <div 
                className="hud-container-alt bg-cyan-950/20 border border-cyan-900/50 p-6 hover:bg-cyan-900/40 hover:border-cyan-500/70 hover-blur-transition shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]"
                style={{
                  opacity: Math.max(0, Math.min(1, opacity * (1 + index * 0.5))),
                  transform: `translateX(${(1 - opacity) * (10 + index * 5)}px)`,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider">{exp.role}</h3>
                    <p className="text-cyan-400 font-mono text-sm tracking-wide">{exp.company}</p>
                  </div>
                  <span className="text-xs text-cyan-200/50 font-mono border border-cyan-900 bg-cyan-950/50 px-3 py-1 hud-container-alt">
                    {exp.startDate} {"//"} {exp.endDate || 'PRESENT'}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm font-light leading-relaxed mb-6">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {exp.techTags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs text-cyan-100 font-mono tracking-widest bg-cyan-900/30 border border-cyan-800/50 px-3 py-1 hud-container-alt uppercase"
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
