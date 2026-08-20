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
        backgroundColor: 'transparent'
      }}
    >
      <div
        ref={progressRef}
        style={{
          height: '100%',
          background: 'linear-gradient(to right, #00f0ff, #f000ff)',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          boxShadow: '0 0 10px rgba(0,240,255,0.3)',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
