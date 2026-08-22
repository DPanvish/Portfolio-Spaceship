'use client';

import { useEffect, useState } from 'react';
import { useSoundStore } from '@/store/useSoundStore';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { isMuted, toggleMute } = useSoundStore();

  useEffect(() => {
    // Scroll listener for visibility
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5; // 50vh
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for active link
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
      }
    );

    const sections = NAV_LINKS.map(link => link.href.substring(1));
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .nav-link {
          color: rgba(255, 255, 255, 0.4);
          transition: color 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .nav-link.active {
          color: #00f0ff;
        }
        .nav-link:active {
          transform: scale(0.97);
        }
        @media (hover: hover) and (pointer: fine) {
          .nav-link:hover:not(.active) {
            color: rgba(255, 255, 255, 0.8);
          }
        }
      `}} />
      <nav
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '9999px',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          gap: '1.5rem',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          transition: 'opacity 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.href.substring(1);
          return (
            <a
              key={link.name}
              href={link.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem', /* text-xs */
                letterSpacing: '0.05em', /* tracking-wider */
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-block',
                willChange: 'transform, color',
              }}
            >
              {link.name}
            </a>
          );
        })}

        {/* Sound Toggle */}
        <button
          onClick={toggleMute}
          className="nav-link flex items-center ml-2 border-l border-white/10 pl-4"
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '0.5rem',
            paddingLeft: '1.5rem',
            borderLeft: '1px solid rgba(255,255,255,0.1)'
          }}
          data-cursor="grow"
        >
          {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
        </button>
      </nav>
    </>
  );
}
