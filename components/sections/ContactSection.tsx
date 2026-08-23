'use client';

import { useState, useEffect } from 'react';
import TextScramble from '@/components/ui/TextScramble';
import TiltCard from '@/components/ui/TiltCard';

export default function ContactSection() {
  const [coords, setCoords] = useState('47.6062, -122.3321');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate updating coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      const lat = (47.6062 + (Math.random() * 0.001 - 0.0005)).toFixed(4);
      const lng = (-122.3321 + (Math.random() * 0.001 - 0.0005)).toFixed(4);
      setCoords(`${lat}, ${lng}`);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <section className="section" id="contact">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Form */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <TextScramble text="// INITIATE TRANSMISSION" className="section-label" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] reveal-up">
                Open a<br />
                <span className="text-white/30">Channel</span>
              </h2>
              <div className="line" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 stagger-group">
              <div className="group relative stagger-item">
                <input 
                  type="text" 
                  id="name" 
                  required 
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder-transparent focus:outline-none focus:border-[color:var(--color-accent)] focus:shadow-[0_1px_10px_-2px_var(--color-accent)] transition-all duration-300 peer"
                  placeholder="Name"
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 top-4 text-white/30 text-sm font-mono transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[color:var(--color-accent)] peer-valid:-top-4 peer-valid:text-xs"
                >
                  [ IDENTIFIER ]
                </label>
              </div>

              <div className="group relative stagger-item">
                <input 
                  type="email" 
                  id="email" 
                  required 
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder-transparent focus:outline-none focus:border-[color:var(--color-accent)] focus:shadow-[0_1px_10px_-2px_var(--color-accent)] transition-all duration-300 peer"
                  placeholder="Email"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 top-4 text-white/30 text-sm font-mono transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[color:var(--color-accent)] peer-valid:-top-4 peer-valid:text-xs"
                >
                  [ COMMS_LINK ]
                </label>
              </div>

              <div className="group relative mt-2 stagger-item">
                <textarea 
                  id="message" 
                  required 
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder-transparent focus:outline-none focus:border-[color:var(--color-accent)] focus:shadow-[0_1px_10px_-2px_var(--color-accent)] transition-all duration-300 peer resize-none"
                  placeholder="Message"
                />
                <label 
                  htmlFor="message" 
                  className="absolute left-0 top-4 text-white/30 text-sm font-mono transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[color:var(--color-accent)] peer-valid:-top-4 peer-valid:text-xs"
                >
                  [ PAYLOAD ]
                </label>
              </div>

              <button 
                type="submit" 
                className="contact-btn self-start mt-4 stagger-item relative overflow-hidden" 
                data-cursor="grow"
                disabled={isSubmitting}
              >
                <span className={`flex items-center gap-2 transition-transform duration-300 ${isSubmitting ? '-translate-y-12' : 'translate-y-0'}`}>
                  Transmit Data
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 8h12M10 4l4 4-4 4" />
                  </svg>
                </span>
                <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isSubmitting ? 'translate-y-0' : 'translate-y-12'}`}>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Decorative Status Card */}
          <div className="reveal-up">
            <TiltCard maxTilt={5}>
              <div className="relative w-full aspect-square md:aspect-[4/3] border border-white/10 bg-black/40 flex flex-col justify-between p-8 overflow-hidden group rounded-xl" data-cursor="grow">
                {/* Background grid */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Glowing accent corner */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[color:var(--color-accent)] opacity-20 blur-[50px] group-hover:opacity-40 transition-opacity duration-700" />

                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">Status</span>
                    <span className="font-mono text-sm text-[color:var(--color-accent)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[color:var(--color-accent)] animate-pulse" />
                      Receiving Signals
                    </span>
                  </div>
                  <span className="font-mono text-xl text-white/10">05</span>
                </div>

                <div className="z-10 flex flex-col gap-4">
                  <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                    Currently available for freelance missions and full-time docking opportunities. 
                    Signal response time is typically within 24 standard hours.
                  </p>
                  
                  <div className="flex flex-col gap-2 mt-2 font-mono text-xs text-white/40">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>COORDINATES</span>
                      <span className="text-[color:var(--color-accent)] transition-all duration-300">{coords}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>ENCRYPTION</span>
                      <span className="text-white/80">Standard SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>
      </div>

      <style jsx>{`
        .contact-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 3rem;
          padding: 0 2rem;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: white;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          transition: transform 0.2s var(--ease-out), background 0.2s var(--ease-out), border-color 0.2s var(--ease-out);
          will-change: transform;
        }

        .contact-btn:active {
          transform: scale(0.97);
        }

        @media (hover: hover) and (pointer: fine) {
          .contact-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </section>
  );
}
