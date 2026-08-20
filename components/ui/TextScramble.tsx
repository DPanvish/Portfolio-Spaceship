'use client'

import React, { useEffect, useRef } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export default function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 30,
}: TextScrambleProps) {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    
    // Pre-scrambled state
    let initialScramble = ''
    for (let i = 0; i < text.length; i++) {
      initialScramble += text[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
    }
    el.textContent = initialScramble

    let resolved = 0
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    function scramble() {
      if (!el) return
      let result = ''
      for (let i = 0; i < text.length; i++) {
        if (i < resolved) {
          result += text[i]
        } else {
          result += text[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
        }
      }
      el.textContent = result
      
      if (resolved < text.length) {
        resolved++
        timeoutId = setTimeout(scramble, speed)
      } else {
        el.textContent = text
      }
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          timeoutId = setTimeout(() => {
            if (el) {
              el.style.opacity = '1'
              scramble()
            }
          }, delay)
        }
      },
      { threshold: 0.5 }
    )
    
    observer.observe(el)
    
    return () => {
      observer.disconnect()
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [text, delay, speed])

  return (
    <span
      ref={spanRef}
      className={className}
      style={{ opacity: 0 }}
      aria-label={text}
    >
      {text}
    </span>
  )
}
