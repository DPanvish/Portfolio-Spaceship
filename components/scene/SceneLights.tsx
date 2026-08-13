'use client';

// SceneLights — the lighting rig for the spaceship journey.
//
// Three-light setup:
//   1. Ambient  → soft base fill, prevents pure black shadows
//   2. Key      → cool blue-white directional from upper-left (starlight)
//   3. Rim      → warm cyan from behind-right (engine glow / accent)
//
// All lights are kept intentionally dim — post-processing bloom will 
// amplify emissive materials in Phase 6, so we avoid over-exposing here.

export default function SceneLights() {
  return (
    <>
      {/* 1. Ambient fill — very dim, just enough to see dark side of meshes */}
      <ambientLight intensity={0.15} color="#1a1f3a" />

      {/* 2. Key light — cool starlight from upper-left */}
      <directionalLight
        position={[-5, 8, 5]}
        intensity={1.2}
        color="#c8d8ff"
        castShadow={false}
      />

      {/* 3. Rim light — cyan engine glow from behind */}
      <pointLight
        position={[3, -2, -8]}
        intensity={0.8}
        color="#00f0ff"
        distance={30}
        decay={2}
      />

      {/* 4. Subtle warm fill from below — planet/nebula bounce light */}
      <pointLight
        position={[0, -10, 0]}
        intensity={0.3}
        color="#ff6030"
        distance={40}
        decay={2}
      />
    </>
  );
}
