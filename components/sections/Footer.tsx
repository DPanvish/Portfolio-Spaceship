'use client';

import { useEffect, useState } from 'react';
import TextScramble from '@/components/ui/TextScramble';
import Logo from '@/components/ui/Logo';

const SYSTEM_LOGS = [
  '> SYSTEM.init()',
  '> Establishing connection...',
  '> Encryption valid',
  '> Ready for input_'
];

export default function Footer({ settings }: { settings?: any }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  // Fake terminal typing effect
  useEffect(() => {
    if (logIndex >= SYSTEM_LOGS.length) return;

    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, SYSTEM_LOGS[logIndex]].slice(-4));
      setLogIndex((prev) => prev + 1);
    }, 800 + Math.random() * 800);

    return () => clearTimeout(timer);
  }, [logIndex]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [];
  if (settings?.github_url) socials.push({ name: 'GitHub', url: settings.github_url });
  if (settings?.twitter_url) socials.push({ name: 'Twitter', url: settings.twitter_url });
  if (settings?.linkedin_url) socials.push({ name: 'LinkedIn', url: settings.linkedin_url });

  // Fallback if no settings
  if (socials.length === 0) {
    socials.push(
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'Twitter', url: 'https://twitter.com' },
      { name: 'LinkedIn', url: 'https://linkedin.com' }
    );
  }

  return (
    <footer className="w-full bg-black pt-16 pb-8 relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[color:var(--color-accent)] to-transparent opacity-30" />
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-end gap-10 relative z-10">
        
        {/* Left: Terminal Logs */}
        <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs text-white/40 h-24 justify-end">
          {logs.map((log, i) => (
            <div key={i} className="animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>{log}</div>
          ))}
          {logIndex >= SYSTEM_LOGS.length && (
            <div className="flex items-center gap-2 text-[color:var(--color-accent)]">
              <span className="w-2 h-3 bg-[color:var(--color-accent)] animate-pulse" />
              <TextScramble text="SYSTEM_ONLINE" delay={500} speed={40} />
            </div>
          )}
        </div>

        {/* Center: Social Links */}
        <div className="flex gap-8 font-mono text-xs tracking-widest uppercase">
          {socials.map((platform) => (
            <a 
              key={platform.name}
              href={platform.url} 
              target="_blank" 
              rel="noreferrer" 
              className="social-link relative text-white/50 hover:text-white transition-colors duration-200 py-1" 
              data-cursor="grow"
            >
              {platform.name}
              <span className="absolute left-0 bottom-0 w-full h-px bg-[color:var(--color-accent)] scale-x-0 origin-right transition-transform duration-300 ease-out" />
            </a>
          ))}
        </div>

        {/* Right: Scroll to top */}
        <div className="flex flex-col items-end gap-4">
          <button 
            onClick={scrollToTop}
            className="scroll-btn w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white/50 transition-all duration-200 ease-out will-change-transform"
            data-cursor="grow"
            aria-label="Scroll to top"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-200 ease-out">
              <path d="M8 13V3M4 7l4-4 4 4" />
            </svg>
          </button>
          <div className="flex items-center gap-2 opacity-40 mt-2">
            <Logo className="w-4 h-4" />
            <span className="font-mono text-[10px] text-white tracking-widest uppercase">
              © {new Date().getFullYear()} SPACESHIP
            </span>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s var(--ease-out) forwards;
        }

        @media (hover: hover) and (pointer: fine) {
          .social-link:hover span {
            scale: 1;
            transform-origin: left;
          }

          .scroll-btn:hover {
            color: white;
            border-color: var(--color-accent);
            background: rgba(0, 240, 255, 0.1);
          }
          
          .scroll-btn:hover svg {
            transform: translateY(-2px);
          }
        }

        .scroll-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </footer>
  );
}
