'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import SceneLights from './SceneLights';
import SpaceBackground from './SpaceBackground';
import Spaceship from './Spaceship';
import PlanetWaypoint from './PlanetWaypoint';

// SceneCanvas is a Client Component — Three.js requires browser APIs.
// It fills the full viewport and will house the entire spaceship journey.

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
      {/* Suspense boundary: children load async; fallback is the dark void */}
      <Suspense fallback={null}>
        <SceneLights />
        <SpaceBackground />

        {/* The player's ship — positioned center-front, rotated to face away */}
        <Spaceship position={[0, -0.3, 0] as const} rotation={[0, Math.PI, 0] as const} />

        {/* First waypoint — a blue planet in the distance */}
        <PlanetWaypoint position={[0, -2, -25] as const} color="#4488ff" />

        {/* Preload warms up all assets in the Suspense subtree */}
        <Preload all />
      </Suspense>

      {/* Adaptive performance — reduces pixel ratio when FPS drops */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
