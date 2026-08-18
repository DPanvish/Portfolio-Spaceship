'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Check if the device has a fine pointer (like a mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer || !cursorRef.current) return;

    let isHovering = false;
    let isBlendMode = false;

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        
        let scale = 1;
        let opacity = 1;

        if (isHovering) {
          scale = 4; // 12px * 4 = 48px
          opacity = 0.5;
        }
        
        // Use translate3d for better performance
        cursorRef.current.style.transform = `translate3d(${x - 6}px, ${y - 6}px, 0) scale(${scale})`;
        cursorRef.current.style.opacity = opacity.toString();
        
        if (isBlendMode) {
          cursorRef.current.style.mixBlendMode = 'difference';
        } else {
          cursorRef.current.style.mixBlendMode = 'normal';
        }
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for data-cursor='grow'
      const growElement = target.closest('[data-cursor="grow"]');
      if (growElement) {
        isHovering = true;
      }
      
      // Check for links or buttons
      const linkElement = target.closest('a, button');
      if (linkElement) {
        isBlendMode = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const growElement = target.closest('[data-cursor="grow"]');
      if (growElement) {
        isHovering = false;
      }
      
      const linkElement = target.closest('a, button');
      if (linkElement) {
        isBlendMode = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '12px',
        height: '12px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        // Emil Kowalski's animation philosophy: only animate transform + opacity
        // Using cubic-bezier(0.23, 1, 0.32, 1) for ease-out
        transition: 'transform 80ms cubic-bezier(0.23, 1, 0.32, 1), opacity 80ms cubic-bezier(0.23, 1, 0.32, 1), mix-blend-mode 80ms step-end',
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
      }}
    />
  );
}
