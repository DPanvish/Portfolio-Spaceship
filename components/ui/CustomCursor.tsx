'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Check hover
      const el = document.elementFromPoint(mouseX, mouseY);
      const magneticEl = el?.closest('[data-cursor="grow"]');
      
      if (magneticEl) {
        if (!isHovering) {
          isHovering = true;
          if (ringRef.current) {
            ringRef.current.style.width = '60px';
            ringRef.current.style.height = '60px';
            ringRef.current.style.opacity = '0.5';
            ringRef.current.style.borderColor = '#00f0ff';
          }
        }
        targetElement = magneticEl;
      } else {
        if (isHovering) {
          isHovering = false;
          targetElement = null;
          if (ringRef.current) {
            ringRef.current.style.width = '32px';
            ringRef.current.style.height = '32px';
            ringRef.current.style.opacity = '1';
            ringRef.current.style.borderColor = 'white';
          }
        }
      }
    };
    
    const update = () => {
      let targetX = mouseX;
      let targetY = mouseY;

      if (isHovering && targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = centerX - mouseX;
        const distY = centerY - mouseY;
        
        targetX = mouseX + distX * 0.3;
        targetY = mouseY + distY * 0.3;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
      
      rAF = requestAnimationFrame(update);
    };

    window.addEventListener('pointermove', onMouseMove, { passive: true });
    rAF = requestAnimationFrame(update);
    
    // Initial dot pos
    if (dotRef.current) {
       dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }

    return () => {
      window.removeEventListener('pointermove', onMouseMove);
      cancelAnimationFrame(rAF);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
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
          zIndex: 9999,
          transition: 'width 120ms cubic-bezier(0.23, 1, 0.32, 1), height 120ms cubic-bezier(0.23, 1, 0.32, 1), opacity 120ms cubic-bezier(0.23, 1, 0.32, 1), border-color 120ms cubic-bezier(0.23, 1, 0.32, 1), transform 120ms cubic-bezier(0.23, 1, 0.32, 1)',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, width, height'
        }}
      />
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
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
    </>
  );
}
