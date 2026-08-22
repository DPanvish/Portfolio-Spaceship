'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import { useSoundStore } from '@/store/useSoundStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const BOOT_SEQUENCE = [
  "INITIALIZING KERNEL...",
  "LOADING CORE MODULES: SUCCESS",
  "ESTABLISHING SECURE CONNECTION...",
  "HANDSHAKE ACCEPTED.",
  "CALIBRATING NAVIGATION SYSTEMS...",
  "WARP DRIVE: OFFLINE",
  "IMPULSE ENGINES: STANDBY",
  "DECRYPTING PORTFOLIO ASSETS...",
  "BYPASSING SECURITY PROTOCOLS...",
  "ACCESS GRANTED.",
  "SYSTEM BOOT COMPLETE."
];

export default function Preloader() {
  const [stage, setStage] = useState<'waiting' | 'booting' | 'hidden'>('waiting');
  const [logs, setLogs] = useState<string[]>([]);
  
  const setReady = useAppStore((state) => state.setReady);
  const unmute = useSoundStore((state) => state.unmute);
  const reducedMotion = useReducedMotion();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const topDoorRef = useRef<HTMLDivElement>(null);
  const bottomDoorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasFinished = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setStage('hidden');
      setReady(true);
      return;
    }
    document.body.style.overflow = 'hidden';
  }, [reducedMotion, setReady]);

  const handleStart = () => {
    // Attempt to unmute and start ambient audio
    unmute();
    setStage('booting');
  };

  useEffect(() => {
    if (stage !== 'booting') return;

    let currentLogIndex = 0;
    
    // Rapidly print boot logs
    const logInterval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = BOOT_SEQUENCE[currentLogIndex];
        return [...prev.slice(-4), nextLog]; // Keep last 5 logs
      });
      
      currentLogIndex++;
      
      if (currentLogIndex >= BOOT_SEQUENCE.length) {
        clearInterval(logInterval);
        
        // Hold on final frame for a moment before opening doors
        setTimeout(() => {
          if (hasFinished.current) return;
          hasFinished.current = true;
          
          const tl = gsap.timeline({
            onComplete: () => {
              setStage('hidden');
              setReady(true);
              document.body.style.overflow = '';
            },
          });

          // 1. Content fades out rapidly
          tl.to(contentRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.inOut'
          });

          // 2. Cinematic doors open vertically
          tl.to(topDoorRef.current, {
            y: '-100%',
            duration: 1.2,
            ease: 'cubic-bezier(0.77, 0, 0.175, 1)' // strong ease-in-out
          }, '+=0.1');
          
          tl.to(bottomDoorRef.current, {
            y: '100%',
            duration: 1.2,
            ease: 'cubic-bezier(0.77, 0, 0.175, 1)'
          }, '<');
          
        }, 600);
      }
    }, 150); // Fast log printing (150ms per line)

    return () => clearInterval(logInterval);
  }, [stage, setReady]);

  if (stage === 'hidden') return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100000] flex flex-col items-center justify-center">
      {/* Top Door */}
      <div 
        ref={topDoorRef} 
        className="absolute top-0 left-0 w-full h-1/2 bg-[#050505] border-b border-white/5 origin-top pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>
      
      {/* Bottom Door */}
      <div 
        ref={bottomDoorRef} 
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#050505] border-t border-white/5 origin-bottom pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>
      
      {/* Content Container */}
      <div 
        ref={contentRef} 
        className="relative z-10 flex flex-col items-center w-full max-w-lg px-6"
        style={{ willChange: 'transform, opacity' }}
      >
        {stage === 'waiting' && (
          <button 
            onClick={handleStart}
            data-cursor="grow"
            className="group relative flex flex-col items-center gap-6 focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-white/20 bg-white/5 group-hover:bg-[color:var(--color-accent-dim)] group-hover:border-[color:var(--color-accent)] transition-all duration-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white group-hover:text-[color:var(--color-accent)] transition-colors duration-500">
                <path d="M5 3l14 9-14 9V3z" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              {/* Outer pulsing ring */}
              <div className="absolute inset-[-10px] rounded-full border border-[color:var(--color-accent)] opacity-0 group-hover:opacity-30 group-hover:animate-ping" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-sm tracking-[0.3em] text-white/70 group-hover:text-white transition-colors duration-300">
                INITIATE SEQUENCE
              </span>
              <span className="font-mono text-[10px] text-white/30">
                [ AUDIO EXPERIENCE INCLUDED ]
              </span>
            </div>
          </button>
        )}

        {stage === 'booting' && (
          <div className="w-full flex flex-col items-start justify-end h-48 font-mono text-xs md:text-sm text-white/60 tracking-wider">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`py-1 ${index === logs.length - 1 ? 'text-[color:var(--color-accent)] animate-pulse' : ''}`}
              >
                <span className="text-white/20 mr-4">[{String(index).padStart(4, '0')}]</span>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
