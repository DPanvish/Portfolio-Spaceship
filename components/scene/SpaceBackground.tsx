'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// SpaceBackground — multi-layer custom particle starfield + nebula clouds.
//
// Three layers:
//   1. Dense distant stars (tiny, white/blue, very slow drift)
//   2. Mid-range stars (varied color, gentle twinkle via opacity)
//   3. A subtle nebula cloud (transparent planes with soft color)
//
// We build the particle geometry manually instead of using drei's <Stars>
// for full control over colors, sizes, and animation.

function createStarField(count: number, spread: number, minSize: number, maxSize: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const colorPalette = [
    new THREE.Color('#ffffff'),  // white
    new THREE.Color('#ccd8ff'),  // cool blue-white
    new THREE.Color('#aaccff'),  // blue
    new THREE.Color('#ffe4c4'),  // warm white
    new THREE.Color('#ffd2a1'),  // amber
    new THREE.Color('#c4c8ff'),  // lavender
  ];

  for (let i = 0; i < count; i++) {
    // Distribute stars in a sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = spread * (0.4 + Math.random() * 0.6);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = minSize + Math.random() * (maxSize - minSize);
  }

  return { positions, colors, sizes };
}

function StarLayer({
  count,
  spread,
  minSize,
  maxSize,
  rotationSpeed = 0.003,
  twinkle = false,
}: {
  count: number;
  spread: number;
  minSize: number;
  maxSize: number;
  rotationSpeed?: number;
  twinkle?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(
    () => createStarField(count, spread, minSize, maxSize),
    [count, spread, minSize, maxSize],
  );

  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * rotationSpeed;
    pointsRef.current.rotation.x += delta * rotationSpeed * 0.3;

    // Twinkle: modulate opacity slightly
    if (twinkle && materialRef.current) {
      materialRef.current.opacity = 0.75 + Math.sin(_state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial 
        ref={materialRef}
        size={1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Nebula Cloud — a distant softly glowing gas cloud
function NebulaCloud({
  position,
  color,
  size = 60,
  opacity = 0.04,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  opacity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Always face camera
    meshRef.current.lookAt(state.camera.position);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function SpaceBackground() {
  return (
    <>
      {/* Layer 1 — Dense distant stars */}
      <StarLayer count={6000} spread={400} minSize={0.3} maxSize={0.8} rotationSpeed={0.002} />

      {/* Layer 2 — Mid-range stars with twinkle */}
      <StarLayer count={1500} spread={200} minSize={0.6} maxSize={1.5} rotationSpeed={0.004} twinkle />

      {/* Layer 3 — Sparse bright nearby stars */}
      <StarLayer count={300} spread={100} minSize={1.0} maxSize={2.5} rotationSpeed={0.006} />

      {/* Nebula Clouds — distant colored gas */}
      <NebulaCloud position={[-120, 40, -250]} color="#1a0040" size={120} opacity={0.035} />
      <NebulaCloud position={[100, -30, -300]} color="#001030" size={100} opacity={0.03} />
      <NebulaCloud position={[50, 80, -200]} color="#100025" size={80} opacity={0.025} />
      <NebulaCloud position={[-80, -60, -180]} color="#0a1530" size={90} opacity={0.02} />
    </>
  );
}
