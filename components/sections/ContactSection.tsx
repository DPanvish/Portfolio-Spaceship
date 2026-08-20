'use client';

import TextScramble from '@/components/ui/TextScramble';
import TiltCard from '@/components/ui/TiltCard';

export default function ContactSection() {
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

            <form className="flex flex-col gap-8 reveal-up" style={{ transitionDelay: '100ms' }}>
              <div className="group relative">
                <input 
                  type="text" 
                  id="name" 
                  required 
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder-transparent focus:outline-none focus:border-white/30 transition-colors peer"
                  placeholder="Name"
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 top-4 text-white/30 text-sm font-mono transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[color:var(--color-accent)] peer-valid:-top-4 peer-valid:text-xs"
                >
                  [ IDENTIFIER ]
                </label>
              </div>

              <div className="group relative">
                <input 
                  type="email" 
                  id="email" 
                  required 
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder-transparent focus:outline-none focus:border-white/30 transition-colors peer"
                  placeholder="Email"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 top-4 text-white/30 text-sm font-mono transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[color:var(--color-accent)] peer-valid:-top-4 peer-valid:text-xs"
                >
                  [ COMMS_LINK ]
                </label>
              </div>

              <div className="group relative mt-2">
                <textarea 
                  id="message" 
                  required 
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white placeholder-transparent focus:outline-none focus:border-white/30 transition-colors peer resize-none"
                  placeholder="Message"
                />
                <label 
                  htmlFor="message" 
                  className="absolute left-0 top-4 text-white/30 text-sm font-mono transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[color:var(--color-accent)] peer-valid:-top-4 peer-valid:text-xs"
                >
                  [ PAYLOAD ]
                </label>
              </div>

              <button 
                type="button" 
                className="btn self-start mt-4" 
                data-cursor="grow"
                onClick={(e) => e.preventDefault()}
              >
                Transmit Data
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8h12M10 4l4 4-4 4" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Column: Decorative Status Card */}
          <div className="reveal-up" style={{ transitionDelay: '200ms' }}>
            <TiltCard maxTilt={5}>
              <div className="relative w-full aspect-square md:aspect-[4/3] border border-white/10 bg-black/40 flex flex-col justify-between p-8 overflow-hidden group" data-cursor="grow">
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
                      <span className="text-white/80">Earth, Sol System</span>
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
    </section>
  );
}
