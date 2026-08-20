'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import SceneLights from './SceneLights';
import Spaceship from './Spaceship';

export default function SceneCanvas() {
  return (
    <Canvas
      id="spaceship-canvas"
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [0, 0.5, 5],
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <SceneLights />
        <Spaceship position={[0, -0.3, 0]} rotation={[0, Math.PI, 0]} />
        <Preload all />
      </Suspense>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
