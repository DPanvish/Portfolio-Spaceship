'use client';

import { useEffect, useState } from 'react';
import { useSoundStore } from '@/store/useSoundStore';
import Logo from '@/components/ui/Logo';

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
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    const sections = NAV_LINKS.map((link) => link.href.substring(1));
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          color: rgba(255, 255, 255, 0.4);
          transition: color 200ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1)), transform 200ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1));
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--color-accent, #00f0ff);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 300ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1));
        }
        .nav-link.active {
          color: var(--color-accent, #00f0ff);
        }
        .nav-link.active::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .nav-link:active {
          transform: scale(0.97);
        }
        @media (hover: hover) and (pointer: fine) {
          .nav-link:hover:not(.active) {
            color: rgba(255, 255, 255, 0.8);
          }
          .nav-logo:hover {
            animation: pulse-logo 2s infinite;
          }
        }
        @keyframes pulse-logo {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
      <nav
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '50%',
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '9999px',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          transform: isVisible ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
          transition: 'opacity 300ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1)), transform 300ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1))',
        }}
      >
        <a 
          href="#top" 
          className="text-white nav-logo transition-colors duration-300 mr-2"
          style={{ willChange: 'transform, opacity' }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Logo className="w-5 h-5" />
        </a>

        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.href.substring(1);
          return (
            <a
              key={link.name}
              href={link.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
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

        <button
          onClick={toggleMute}
          className="nav-link flex items-center ml-2 border-l border-white/10 pl-4"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '0.5rem',
            paddingLeft: '1.5rem',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform'
          }}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          data-cursor="grow"
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          )}
        </button>
      </nav>
    </>
  );
}
