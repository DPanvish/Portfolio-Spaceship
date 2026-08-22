'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    
    if (mq.matches !== isFinePointer) {
      setIsFinePointer(mq.matches);
    }

    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [isFinePointer]);

  useEffect(() => {
    if (!isFinePointer) return;

    // Add cursor: none globally
    const style = document.createElement('style');
    style.innerHTML = '* { cursor: none !important; }';
    document.head.appendChild(style);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let isHovering = false;
    let targetElement: Element | null = null;
    let rAF: number;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Use event delegation for hover states
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magneticEl = target.closest('[data-cursor="grow"]');
      
      if (magneticEl) {
        isHovering = true;
        targetElement = magneticEl;
        if (ringRef.current) {
          ringRef.current.style.width = '60px';
          ringRef.current.style.height = '60px';
          ringRef.current.style.opacity = '0.5';
          ringRef.current.style.borderColor = '#00f0ff';
        }
      } else if (isHovering) {
        isHovering = false;
        targetElement = null;
        if (ringRef.current) {
          ringRef.current.style.width = '32px';
          ringRef.current.style.height = '32px';
          ringRef.current.style.opacity = '1';
          ringRef.current.style.borderColor = 'white';
        }
      }
    };

    const loop = () => {
      let targetX = mouseX;
      let targetY = mouseY;

      if (isHovering && targetElement) {
        // Magnetic pull
        const rect = targetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        targetX = mouseX + (centerX - mouseX) * 0.3;
        targetY = mouseY + (centerY - mouseY) * 0.3;
      }

      // Smooth follow for the ring
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rAF = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    
    rAF = requestAnimationFrame(loop);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rAF);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          border: '1.5px solid white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          transition: 'width 150ms var(--ease-out), height 150ms var(--ease-out), border-color 150ms var(--ease-out), opacity 150ms var(--ease-out)',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
      {/* Inner Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '5px',
          height: '5px',
          backgroundColor: 'white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
    </>
  );
}
