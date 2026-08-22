'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { useAppStore } from '@/store/useAppStore';

export default function Preloader() {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const setReady = useAppStore((state) => state.setReady);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hasFinished = useRef(false);

  // Failsafe progress interpolation (guaranteed to hit 100 in ~1.5s)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8 + 2; // Random jumps for realistic feel
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setDisplayProgress(current);
    }, 40); // 40ms * ~20 ticks = 800ms + random variance

    // Hard failsafe
    const timeout = setTimeout(() => setDisplayProgress(100), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // Lock scroll while preloading
    document.body.style.overflow = 'hidden';

    // When progress reaches 100%, animate the preloader out ONLY ONCE
    if (displayProgress >= 100 && !hasFinished.current) {
      hasFinished.current = true;
      
      const tl = gsap.timeline({
        onComplete: () => {
          setHidden(true);
          setReady(true);
          document.body.style.overflow = '';
        },
        delay: 0.2 // Brief pause at 100%
      });

      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power3.in'
      }, 0)
      .to(barRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in'
      }, 0.1)
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0.2);
    }
  }, [displayProgress, setReady]);

  if (hidden) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black text-white pointer-events-none"
    >
      {/* Decorative noise/grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="relative flex flex-col items-center gap-6 w-full max-w-sm px-8">
        {/* Text */}
        <div ref={textRef} className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
            Initializing Flight Systems
          </span>
          <span className="font-mono text-3xl font-bold tracking-tight text-[color:var(--color-accent)]">
            {Math.round(displayProgress)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-px bg-white/10 relative overflow-hidden">
          <div 
            ref={barRef}
            className="absolute top-0 left-0 h-full bg-[color:var(--color-accent)] origin-left"
            style={{ width: `${displayProgress}%`, transition: 'width 0.1s ease-out' }}
          />
          {/* Glowing dot at the end of progress */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[color:var(--color-accent)] rounded-full shadow-[0_0_10px_#00f0ff] transition-all duration-100"
            style={{ left: `calc(${displayProgress}% - 3px)` }}
          />
        </div>
      </div>
    </div>
  );
}
