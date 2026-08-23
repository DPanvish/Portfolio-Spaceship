'use client';

import React from 'react';

interface MarqueeProps {
  text: string;
  speed?: number;
}

export default function Marquee({ text, speed = 30 }: MarqueeProps) {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '1rem 0',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
      }}
    >
      <style>
        {`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
      <div
        className="font-mono text-xs uppercase text-white/15"
        style={{
          display: 'inline-block',
          letterSpacing: '0.5em',
          animation: `marquee-scroll ${speed}s linear infinite`,
          willChange: 'transform'
        }}
      >
        {Array(2).fill(0).map((_, i) => (
          <span key={i}>
            {Array(20).fill(text).map((t, idx) => (
              <React.Fragment key={idx}>
                {t}
                <span 
                  style={{ 
                    color: 'var(--color-accent, #00f0ff)', 
                    filter: 'drop-shadow(0 0 5px rgba(0,240,255,0.5))',
                    margin: '0 1em'
                  }}
                >
                  ·
                </span>
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
