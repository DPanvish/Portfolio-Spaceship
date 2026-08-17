'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import SceneLights from './SceneLights';
import SpaceBackground from './SpaceBackground';
import JourneyRig from './JourneyRig';
import PortalGateway from './PortalGateway';

export default function SceneCanvas() {
  return (
    <Canvas
      id="spaceship-canvas"
      camera={{
        fov: 55,
        near: 0.1,
        far: 1000,
        position: [0, 1.5, 6],
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* The ship and camera controller */}
        <JourneyRig />
        
        <SceneLights />
        <SpaceBackground />

        {/* Portal 1: About */}
        <PortalGateway position={[0, 0, -100]} color="#00f0ff" label="ABOUT" />
        
        {/* Portal 2: Experience */}
        <PortalGateway position={[0, 0, -200]} color="#f000ff" label="EXPERIENCE" />

        <Preload all />
      </Suspense>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
