'use client';

import { Stars } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// SpaceBackground — a slowly rotating starfield using drei's <Stars>.
//
// Stars params tuned for:
//   - radius:    the sphere radius the stars are spread across
//   - depth:     how deep the star field goes (layered parallax)
//   - count:     enough stars to feel vast but not crush GPU
//   - factor:    size multiplier
//   - saturation / fade: softens edges so stars don't look pasted-on

export default function SpaceBackground() {
  const starsRef = useRef<THREE.Points>(null);

  // Very slow drift rotation — adds life without distraction.
  useFrame((_state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.005;
      starsRef.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <>
      {/* Primary star layer — dense, small, distant */}
      <Stars
        ref={starsRef}
        radius={300}
        depth={60}
        count={4000}
        factor={3}
        saturation={0.3}
        fade
        speed={0}
      />

      {/* Secondary layer — sparser, slightly larger foreground stars */}
      <Stars
        radius={80}
        depth={30}
        count={800}
        factor={4}
        saturation={0.6}
        fade
        speed={0}
      />

      {/* The deep black void fog — subtle depth cue */}
      <fog attach="fog" args={['#000005', 80, 500]} />
    </>
  );
}
