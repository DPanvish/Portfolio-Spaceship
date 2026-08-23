'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import SceneCanvas from '@/components/scene/SceneCanvas';
import TextScramble from '@/components/ui/TextScramble';

import { useAppStore } from '@/store/useAppStore';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shipContainerRef = useRef<HTMLDivElement>(null);
  const isReady = useAppStore((state) => state.isReady);

  // Cinematic launch sequence on mount (waits for Preloader)
  useEffect(() => {
    if (!headingRef.current || !isReady) return;

    const chars = headingRef.current.querySelectorAll('.char');
    const tl = gsap.timeline();

    // 1. Ship drops in from top with a warp effect
    if (shipContainerRef.current) {
      tl.fromTo(
        shipContainerRef.current,
        { y: '-100vh', scale: 0.2, rotateX: 45 },
        {
          y: '0',
          scale: 1,
          rotateX: 0,
          duration: 2.5, // cinematic drop
          ease: 'power4.out',
        },
        0
      );
    }

    // 2. Stagger each character in
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
      },
      1.0 // Start when ship is mostly settled
    );

    // 3. Fade in the rest of the content
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
  }, [isReady]);

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
        ref={shipContainerRef}
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
        <div ref={contentRef} className="flex flex-col gap-6 max-w-3xl items-start">
          <div className="hero-fade inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 backdrop-blur-md" style={{ opacity: 0 }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Available for work</span>
          </div>

          <TextScramble text="// MISSION CONTROL" className="section-label hero-fade" delay={200} />

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
            <a href="#projects" className="hero-btn" data-cursor="grow">
              View Work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-200">
                <path d="M8 3v10M4 9l4 4 4-4" />
              </svg>
            </a>
            <a href="#about" className="hero-btn hero-btn-secondary" data-cursor="grow">
              About Me
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 hero-fade" style={{ opacity: 0 }}>
        <span className="text-white/30 font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-16 relative overflow-hidden bg-white/10">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[color:var(--color-accent)] animate-scroll-line" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .animate-scroll-line {
          animation: scroll-line 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }

        .hero-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: white;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          transition: transform 0.2s var(--ease-out), opacity 0.2s var(--ease-out), background 0.2s var(--ease-out);
          will-change: transform;
        }

        .hero-btn:active {
          transform: scale(0.97);
        }

        @media (hover: hover) and (pointer: fine) {
          .hero-btn:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .hero-btn:hover svg {
            transform: translateY(2px);
          }
        }
        
        .hero-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 9999px;
          background: linear-gradient(45deg, var(--color-accent), transparent, var(--color-accent));
          opacity: 0;
          transition: opacity 0.3s var(--ease-out);
          z-index: -1;
        }

        @media (hover: hover) and (pointer: fine) {
          .hero-btn:hover::before {
            opacity: 0.5;
          }
        }

        .hero-btn-secondary::before {
          display: none;
        }
      `}</style>
    </section>
  );
}
