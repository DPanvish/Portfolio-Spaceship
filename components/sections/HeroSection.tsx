'use client';

import { useRef, useEffect } from 'react';
import SceneCanvas from '@/components/scene/SceneCanvas';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="section relative" id="hero">
      {/* CSS star background */}
      <div className="stars" />

      {/* 3D Spaceship — decorative only, no scroll control */}
      <div className="absolute inset-0 z-[1]">
        <SceneCanvas />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex flex-col gap-6 max-w-3xl">
          <p className="section-label reveal-up">{"// Mission Control"}</p>

          <h1 className="display-heading reveal-up" style={{ transitionDelay: '50ms' }}>
            Creative<br />Developer
          </h1>

          <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-xl reveal-up" style={{ transitionDelay: '100ms' }}>
            Building high-performance, cinematic web experiences 
            using React, Three.js, and WebGL.
          </p>

          <div className="flex gap-4 mt-4 reveal-up" style={{ transitionDelay: '150ms' }}>
            <a href="#about" className="btn">
              Explore
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 3v10M4 9l4 4 4-4" />
              </svg>
            </a>
            <a href="#experience" className="btn">
              View Work
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 reveal-up">
        <span className="text-white/20 font-mono text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
