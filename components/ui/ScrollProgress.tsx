'use client';

import React, { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!progressRef.current) return;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const max = docHeight - winHeight;
      const progress = max > 0 ? scrollY / max : 0;
      
      progressRef.current.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        zIndex: 100,
        backgroundColor: 'transparent',
        pointerEvents: 'none'
      }}
    >
      <div
        ref={progressRef}
        style={{
          height: '100%',
          backgroundColor: 'var(--color-accent, #00f0ff)',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          boxShadow: '0 0 10px var(--color-accent-dim, rgba(0,240,255,0.5))',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
