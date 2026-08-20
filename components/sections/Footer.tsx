'use client';

import { useEffect, useState } from 'react';
import TextScramble from '@/components/ui/TextScramble';

const SYSTEM_LOGS = [
  '[SYS] Initializing core protocols...',
  '[SYS] Establishing secure connection...',
  '[NAV] Coordinates locked: Sector 7G',
  '[ENG] Thrusters at optimal capacity',
  '[COM] Encryption handshakes completed',
  '[SYS] All systems nominal',
  '[USR] Awaiting command input...'
];

export default function Footer() {
  const [logs, setLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  // Fake terminal typing effect
  useEffect(() => {
    if (logIndex >= SYSTEM_LOGS.length) return;

    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, SYSTEM_LOGS[logIndex]].slice(-4)); // Keep only last 4 logs
      setLogIndex((prev) => prev + 1);
    }, 800 + Math.random() * 1000); // Random delay between logs

    return () => clearTimeout(timer);
  }, [logIndex]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 bg-black pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-end gap-10 relative z-10">
        
        {/* Left: Terminal Logs */}
        <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs text-white/30 h-24 justify-end">
          {logs.map((log, i) => (
            <div key={i} className="animate-fade-in">{log}</div>
          ))}
          <div className="flex items-center gap-2 text-[color:var(--color-accent)]">
            <span className="w-2 h-3 bg-[color:var(--color-accent)] animate-pulse" />
            <TextScramble text="SYSTEM_ONLINE" delay={2000} speed={40} />
          </div>
        </div>

        {/* Center: Social Links */}
        <div className="flex gap-6 font-mono text-xs tracking-widest uppercase">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" data-cursor="grow">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" data-cursor="grow">
            Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" data-cursor="grow">
            LinkedIn
          </a>
        </div>

        {/* Right: Scroll to top */}
        <div className="flex flex-col items-end gap-4">
          <button 
            onClick={scrollToTop}
            className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)]/10 transition-all"
            data-cursor="grow"
            aria-label="Scroll to top"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 13V3M4 7l4-4 4 4" />
            </svg>
          </button>
          <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
            © {new Date().getFullYear()} SPACESHIP
          </span>
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </footer>
  );
}
