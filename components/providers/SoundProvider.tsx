'use client';

import { useEffect } from 'react';
import { useSoundStore } from '@/store/useSoundStore';

/**
 * SoundProvider
 * Globally attaches hover and click event listeners to interactive elements
 * (like anchors, buttons, and anything with data-cursor="grow").
 */
export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const { playHover, playClick } = useSoundStore();

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Play hover sound for links, buttons, or custom magnetic elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="grow"]')
      ) {
        playHover();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        playClick();
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, [playHover, playClick]);

  return <>{children}</>;
}
