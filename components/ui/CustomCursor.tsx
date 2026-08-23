'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
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

    let isHovering = false;

    // Instant update, no rAF loop lag
    const onMouseMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) ${isHovering ? 'scale(5)' : 'scale(1)'}`;
      }
    };

    // Use event delegation for hover states
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magneticEl = target.closest('[data-cursor="grow"]');
      
      if (magneticEl) {
        isHovering = true;
        if (dotRef.current) {
          // Keep it at current position but scale it up
          // We don't snap to center anymore, we just grow it
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(6)`;
          dotRef.current.style.mixBlendMode = 'normal';
          dotRef.current.style.backgroundColor = 'rgba(0, 240, 255, 0.2)';
          dotRef.current.style.border = '1px solid #00f0ff';
        }
      } else if (isHovering) {
        isHovering = false;
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`;
          dotRef.current.style.mixBlendMode = 'difference';
          dotRef.current.style.backgroundColor = 'white';
          dotRef.current.style.border = 'none';
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '10px',
        height: '10px',
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 999999,
        mixBlendMode: 'difference',
        transform: 'translate(-50%, -50%) scale(1)',
        transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms ease, border 200ms ease',
        willChange: 'transform'
      }}
    />
  );
}
