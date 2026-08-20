'use client'

import React, { useRef, useEffect } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    
    const mediaQuery = window.matchMedia('(pointer: fine)')
    if (!mediaQuery.matches) return

    let rafId: number | null = null

    const handlePointerMove = (e: PointerEvent) => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = e.clientX
        const mouseY = e.clientY
        
        const rotateY = ((mouseX - centerX) / (rect.width / 2)) * maxTilt
        const rotateX = -((mouseY - centerY) / (rect.height / 2)) * maxTilt
        
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      })
    }

    const handlePointerLeave = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`
      })
    }

    card.addEventListener('pointermove', handlePointerMove)
    card.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      card.removeEventListener('pointermove', handlePointerMove)
      card.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [maxTilt])

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)',
        willChange: 'transform',
        transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
      }}
    >
      {children}
    </div>
  )
}
