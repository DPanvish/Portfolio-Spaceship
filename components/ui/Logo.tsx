'use client';

import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function Logo({ className = '', ...props }: LogoProps) {
  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M16 2L30 28H23L16 15L9 28H2L16 2Z" fill="currentColor"/>
      <path d="M16 20L20 28H12L16 20Z" fill="var(--color-accent)"/>
    </svg>
  );
}
