'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense } from 'react';
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
      // Camera starts pulled back, looking forward along the journey path.
      camera={{
        fov: 60,
        near: 0.1,
        far: 1000,
        position: [0, 0, 10],
      }}
      // Flat tone-mapping keeps post-processing control with us, not Three.js.
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      // Allow CSS to control canvas size (full screen via parent div).
      style={{ position: 'absolute', inset: 0 }}
      // Lower pixel ratio on low-end devices for performance (Phase 7).
      dpr={[1, 2]}
    >
      {/* Suspense boundary: children load async; fallback is the dark void */}
      <Suspense fallback={null}>
        <SceneLights />
        <SpaceBackground />
        
        {/* The player's ship */}
        <Spaceship position={[0, -1, 4]} />
        
        {/* Waypoint models added in Phase 4 */}
        <PlanetWaypoint position={[0, -2, -15]} color="#4488ff" />

        {/* Preload warms up all assets in the Suspense subtree */}
        <Preload all />
      </Suspense>

      {/* Adaptive performance — reduces pixel ratio when FPS drops */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
