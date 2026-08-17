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
        className="w-full max-w-2xl p-8 mx-4 rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-md pointer-events-auto shadow-[0_0_50px_rgba(0,240,255,0.1)]"
        style={{
          transform: `scale(${0.95 + opacity * 0.05}) translateY(${(1 - opacity) * 20}px)`,
        }}
      >
        <div className="flex items-start gap-8">
          {/* Avatar / Profile Frame */}
          <div className="shrink-0 relative">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-cyan-500/50">
              <img 
                src={content.profilePhoto} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Sci-fi decor */}
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-cyan-400 font-mono text-sm mb-2 tracking-widest uppercase">
              // Subject Database_
            </p>
            <h2 className="text-3xl font-bold text-white mb-6">
              {content.headline}
            </h2>
            
            <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
              <p>{content.bio}</p>
            </div>

            <div className="mt-8 flex gap-4">
              <a 
                href={content.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-interactive hover-blur-transition px-6 py-2 rounded border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:text-white font-mono text-sm tracking-wide inline-block"
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
