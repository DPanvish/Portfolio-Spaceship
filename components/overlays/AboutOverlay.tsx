'use client';

import { useStore } from '@/store/useStore';
import { getAbout } from '@/lib/content';
import { useEffect, useState } from 'react';
import type { About } from '@/lib/content-types';

export default function AboutOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const [content, setContent] = useState<About | null>(null);

  useEffect(() => {
    // In Phase 8, this will fetch from a real API/database.
    // For now, it instantly resolves our mock data.
    getAbout().then(setContent);
  }, []);

  // Calculate opacity based on scroll progress.
  // Waypoint 1 (About) is at t = 0.2
  // We want it visible between 0.12 and 0.28, fully opaque at 0.2
  const center = 0.2;
  const spread = 0.08;
  const distance = Math.abs(scrollProgress - center);
  const opacity = Math.max(0, 1 - distance / spread);

  // If completely invisible, don't render to save DOM updates
  if (opacity === 0 || !content) return null;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity }}
    >
      {/* Viewscreen Panel */}
      <div 
        className="relative w-full max-w-2xl p-8 mx-4 hud-container scanline bg-black/60 backdrop-blur-xl border border-cyan-500/50 pointer-events-auto shadow-[0_0_80px_rgba(0,240,255,0.15)]"
        style={{
          transform: `scale(${0.95 + opacity * 0.05}) translateY(${(1 - opacity) * 20}px)`,
        }}
      >
        <div className="flex items-start gap-8 relative z-10">
          {/* Avatar / Profile Frame */}
          <div className="shrink-0 relative target-brackets p-1">
            <div className="w-32 h-32 hud-container-alt overflow-hidden bg-cyan-950/30">
              <img 
                src={content.profilePhoto} 
                alt="Profile"
                className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
              />
            </div>
            {/* Absolute positioning decor */}
            <div className="absolute top-0 right-0 w-2 h-8 bg-cyan-500/20" />
            <div className="absolute bottom-0 left-0 w-8 h-2 bg-cyan-500/20" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-cyan-400 font-mono text-xs mb-2 tracking-[0.2em] uppercase blinking-cursor">
              // Subject Database
            </p>
            <h2 className="text-4xl font-mono font-bold text-white mb-6 uppercase tracking-wider">
              {content.headline}
            </h2>
            
            <div className="space-y-4 text-gray-300 leading-relaxed text-sm font-light">
              <p>{content.bio}</p>
            </div>

            <div className="mt-8 flex gap-4">
              <a 
                href={content.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-interactive hover-blur-transition px-8 py-3 hud-container-alt border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-sm tracking-widest uppercase inline-block shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]"
              >
                [ Download_Dossier ]
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
