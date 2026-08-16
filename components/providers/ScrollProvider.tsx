'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard exponential ease-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Update Lenis on every frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // Create a master ScrollTrigger that spans the entire page
    // and updates our global Zustand store with the progress (0 to 1).
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      st.kill();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [setScrollProgress]);

  return (
    // We add a massive height to the container so we have something to scroll.
    // The height determines how long the journey takes to scroll through.
    // 600vh means 6 viewport heights of scrolling.
    <div ref={containerRef} className="w-full relative" style={{ height: '600vh' }}>
      {/* The children (the Canvas + Overlays) are fixed to the viewport */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
