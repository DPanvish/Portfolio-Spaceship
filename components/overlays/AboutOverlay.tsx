'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

async function getAbout() {
  return {
    headline: "Frontend Architect",
    paragraph1: "Building high-performance, cinematic web experiences using React, Three.js, and WebGL.",
    paragraph2: "Bridging the gap between design engineering and technical architecture.",
    skills: ['React', 'Three.js', 'Next.js', 'Framer Motion', 'WebGL', 'GSAP']
  };
}

export default function AboutOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    getAbout().then(setContent);
  }, []);

  // Ship is PARKED at Portal 1 during scroll [0.10 – 0.35].
  // Fade in over [0.10 – 0.14], full opacity [0.14 – 0.31], fade out [0.31 – 0.35].
  let opacity = 0;
  if (scrollProgress >= 0.10 && scrollProgress <= 0.35) {
    if (scrollProgress < 0.14) {
      opacity = (scrollProgress - 0.10) / 0.04; // fade in
    } else if (scrollProgress > 0.31) {
      opacity = 1 - (scrollProgress - 0.31) / 0.04; // fade out
    } else {
      opacity = 1; // fully visible
    }
  }

  if (!content) return null;

  const isVisible = opacity > 0.01;

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-start p-12 md:p-24"
      style={{
        opacity,
        zIndex: isVisible ? 10 : -1,
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl pointer-events-auto"
          >
            <div className="overlay-panel p-8 relative">
              {/* Accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
                className="h-px bg-cyan-500/40 mb-8 origin-left"
              />

              <p className="text-cyan-400/80 font-mono text-xs tracking-[0.3em] uppercase mb-3">
                {"// About"}
              </p>

              <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 tracking-tight leading-tight">
                {content.headline}
              </h2>

              <div className="space-y-4 text-white/60 text-base md:text-lg leading-relaxed">
                <p>{content.paragraph1}</p>
                <p>{content.paragraph2}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {content.skills.map((skill: string, i: number) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="px-3 py-1.5 border border-white/10 bg-white/5 text-white/70 font-mono text-xs uppercase tracking-wider"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
