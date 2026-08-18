'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollProvider — NO Lenis. Just GSAP ScrollTrigger with native browser scroll.
 * Lenis was causing the "stuck" issue by conflicting with ScrollTrigger's RAF loop.
 *
 * This provider sets up scroll-triggered reveal animations for all .reveal-* elements.
 */
export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate all .reveal-up elements when they enter the viewport
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Animate all .reveal-left elements
      gsap.utils.toArray<HTMLElement>('.reveal-left').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Animate all .reveal-right elements
      gsap.utils.toArray<HTMLElement>('.reveal-right').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Animate all .reveal-scale elements
      gsap.utils.toArray<HTMLElement>('.reveal-scale').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Animate .line elements (width expansion)
      gsap.utils.toArray<HTMLElement>('.line').forEach((el) => {
        gsap.to(el, {
          width: '100%',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        });
      });

      // Stagger animations for groups
      gsap.utils.toArray<HTMLElement>('.stagger-group').forEach((group) => {
        const items = group.querySelectorAll('.stagger-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
