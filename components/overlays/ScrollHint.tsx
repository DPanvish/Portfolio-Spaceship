'use client';

import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollHint() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const isAtStart = scrollProgress < 0.02;

  return (
    <>
      {/* "Scroll to explore" — only visible at the very start */}
      <AnimatePresence>
        {isAtStart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          >
            <span className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase">
              Scroll to explore
            </span>
            {/* Animated chevron */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-5 h-5 border-b-2 border-r-2 border-white/30 rotate-45"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar — thin line on the right edge */}
      <div className="fixed right-0 top-0 bottom-0 w-[2px] z-20 bg-white/5">
        <motion.div
          className="w-full bg-white/30 origin-top"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Waypoint dots on the progress bar */}
      {[0.10, 0.50].map((wp, i) => (
        <div
          key={i}
          className="fixed right-0 w-2 h-2 -translate-x-[3px] z-20 rounded-full transition-colors duration-300"
          style={{
            top: `${wp * 100}%`,
            backgroundColor: scrollProgress >= wp ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)',
          }}
        />
      ))}
    </>
  );
}
