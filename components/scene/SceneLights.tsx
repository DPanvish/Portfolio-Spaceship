'use client';

// SceneLights — the lighting rig for the spaceship journey.
//
// Five-light setup designed for metallic ship materials:
//   1. Ambient  → cool, very dim base fill
//   2. Key      → cool blue-white from upper-front-left (main starlight)
//   3. Fill     → warmer, softer from the right to reveal wing details
//   4. Rim/Back → strong cyan from behind (engine backlight, silhouette edge)
//   5. Under    → warm orange from below (distant planet reflection)
//
// The lighting is tuned to work with MeshStandardMaterial metalness ~0.85
// and will look even better once post-processing bloom lands in Phase 6.

export default function SceneLights() {
  return (
    <>
      {/* 1. Ambient — cool dark blue fill */}
      <ambientLight intensity={0.25} color="#1e2a40" />

      {/* 2. Key — main starlight from upper-front-left */}
      <directionalLight
        position={[-4, 6, 4]}
        intensity={1.8}
        color="#d0deff"
      />

      {/* 3. Fill — softer warm from the right to bring out wing geometry */}
      <directionalLight
        position={[5, 2, 2]}
        intensity={0.6}
        color="#ffe8d0"
      />

      {/* 4. Rim — strong cyan from behind for engine glow edge-lighting */}
      <pointLight
        position={[0, 0, 8]}
        intensity={1.5}
        color="#00f0ff"
        distance={25}
        decay={2}
      />

      {/* 5. Under fill — warm planet bounce from below */}
      <pointLight
        position={[0, -8, -5]}
        intensity={0.4}
        color="#ff7040"
        distance={30}
        decay={2}
      />

      {/* 6. Distant starlight — very faint from far behind, helps depth */}
      <directionalLight
        position={[0, 0, -20]}
        intensity={0.15}
        color="#8090c0"
      />
    </>
  );
}
