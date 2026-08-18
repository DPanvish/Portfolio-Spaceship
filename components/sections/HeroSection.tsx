'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import SceneCanvas from '@/components/scene/SceneCanvas';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Character-by-character text animation on mount
  useEffect(() => {
    if (!headingRef.current) return;

    const chars = headingRef.current.querySelectorAll('.char');
    const tl = gsap.timeline({ delay: 0.3 });

    // Stagger each character in
    tl.fromTo(
      chars,
      { opacity: 0, y: 60, rotateX: -40 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power3.out',
      }
    );

    // Fade in the rest of the content
    if (contentRef.current) {
      const items = contentRef.current.querySelectorAll('.hero-fade');
      tl.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }

    return () => { tl.kill(); };
  }, []);

  // Mouse parallax on the hero section
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Only on devices with a fine pointer
    if (!window.matchMedia('(pointer: fine)').matches) return;

    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Move the 3D canvas container slightly
      const canvas = section!.querySelector<HTMLElement>('[data-parallax="deep"]');
      if (canvas) {
        canvas.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
      }

      // Move the text slightly in opposite direction
      const text = section!.querySelector<HTMLElement>('[data-parallax="text"]');
      if (text) {
        text.style.transform = `translate(${x * -5}px, ${y * -3}px)`;
      }
    }

    section.addEventListener('pointermove', handleMove);
    return () => section.removeEventListener('pointermove', handleMove);
  }, []);

  // Helper to split text into individual character spans
  function splitChars(text: string) {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ perspective: '600px' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }

  return (
    <section ref={sectionRef} className="section relative" id="hero">
      {/* CSS star background */}
      <div className="stars" />

      {/* 3D Spaceship — decorative, with mouse parallax */}
      <div
        className="absolute inset-0 z-[1] transition-transform duration-300 ease-out"
        data-parallax="deep"
      >
        <SceneCanvas />
      </div>

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Hero Content */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24"
        data-parallax="text"
      >
        <div ref={contentRef} className="flex flex-col gap-6 max-w-3xl">
          <p className="section-label hero-fade" style={{ opacity: 0 }}>
            {"// Mission Control"}
          </p>

          <h1
            ref={headingRef}
            className="display-heading"
            data-cursor="grow"
          >
            <span className="block">{splitChars('Creative')}</span>
            <span className="block text-white/30">{splitChars('Developer')}</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl leading-relaxed max-w-xl hero-fade" style={{ opacity: 0 }}>
            Building high-performance, cinematic web experiences 
            using React, Three.js, and WebGL.
          </p>

          <div className="flex gap-4 mt-4 hero-fade" style={{ opacity: 0 }}>
            <a href="#projects" className="btn" data-cursor="grow">
              View Work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 3v10M4 9l4 4 4-4" />
              </svg>
            </a>
            <a href="#about" className="btn" data-cursor="grow">
              About Me
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hero-fade" style={{ opacity: 0 }}>
        <span className="text-white/15 font-mono text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-12 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/30 to-transparent animate-scroll-line" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
