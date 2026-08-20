'use client';

import React from 'react';

interface MarqueeProps {
  text: string;
  speed?: number;
}

export default function Marquee({ text, speed = 30 }: MarqueeProps) {
  const repeatedText = Array(20).fill(text).join(' · ') + ' · ';
  
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '1rem 0',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)'
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
        className="font-mono text-xs uppercase text-white/10"
        style={{
          display: 'inline-block',
          letterSpacing: '0.5em',
          animation: `marquee-scroll ${speed}s linear infinite`
        }}
      >
        <span>{repeatedText}</span>
        <span>{repeatedText}</span>
      </div>
    </div>
  );
}
