'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
      dpr={[1, 1.5]}  
    >
      <Suspense fallback={null}>
        <JourneyRig />
        <SceneLights />
        <SpaceBackground />

        {/* Portal 1: About — cyan */}
        <PortalGateway position={[0, 0, -100]} color="#00f0ff" label="ABOUT" />

        {/* Portal 2: Experience — magenta */}
        <PortalGateway position={[0, 0, -200]} color="#f000ff" label="EXPERIENCE" />

        <Preload all />

        {/* Single lightweight Bloom pass — no ChromaticAberration */}
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.4}
            mipmapBlur
            intensity={0.8}
          />
        </EffectComposer>
      </Suspense>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
