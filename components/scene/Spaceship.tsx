'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Spaceship — a detailed procedural model built from Three.js geometry.
// Aerodynamic fuselage with swept wings, dual engines, cockpit canopy,
// glowing engine exhausts, and antenna details.

type SpaceshipProps = React.ComponentPropsWithoutRef<'group'>;

export default function Spaceship(props: SpaceshipProps) {
  const shipRef = useRef<THREE.Group>(null);
  const exhaustLeftRef = useRef<THREE.Mesh>(null);
  const exhaustRightRef = useRef<THREE.Mesh>(null);

  // Shared materials (memoized to avoid re-creation every render)
  const materials = useMemo(() => ({
    hull: new THREE.MeshStandardMaterial({
      color: '#8090a0',
      roughness: 0.25,
      metalness: 0.85,
    }),
    hullDark: new THREE.MeshStandardMaterial({
      color: '#3a4550',
      roughness: 0.3,
      metalness: 0.9,
    }),
    cockpit: new THREE.MeshPhysicalMaterial({
      color: '#00d4ff',
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 0.3,
      clearcoat: 1,
      emissive: '#004060',
      emissiveIntensity: 0.4,
    }),
    engineGlow: new THREE.MeshBasicMaterial({
      color: '#00eeff',
      transparent: true,
      opacity: 0.9,
    }),
    exhaustGlow: new THREE.MeshBasicMaterial({
      color: '#00ccff',
      transparent: true,
      opacity: 0.6,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: '#00a0c0',
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    }),
  }), []);

  // Idle hover + engine pulse
  useFrame((state) => {
    if (!shipRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle bobbing
    shipRef.current.position.y = Math.sin(t * 1.2) * 0.06;
    // Micro yaw sway
    shipRef.current.rotation.z = Math.sin(t * 0.7) * 0.02;
    // Slight pitch
    shipRef.current.rotation.x = Math.sin(t * 0.5) * 0.03;

    // Pulsating engine exhaust
    const pulse = 0.7 + Math.sin(t * 6) * 0.3;
    if (exhaustLeftRef.current) {
      exhaustLeftRef.current.scale.set(1, 1, pulse);
    }
    if (exhaustRightRef.current) {
      exhaustRightRef.current.scale.set(1, 1, pulse);
    }
  });

  return (
    <group ref={shipRef} {...props} scale={0.6}>
      {/* ─── Main Fuselage ─── */}
      {/* Nose cone (tapered front) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1.2]} material={materials.hull}>
        <coneGeometry args={[0.35, 2.0, 12]} />
      </mesh>

      {/* Central body (smooth cylinder) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.3]} material={materials.hull}>
        <cylinderGeometry args={[0.4, 0.35, 2.2, 12]} />
      </mesh>

      {/* Rear body (wider engine housing) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.6]} material={materials.hullDark}>
        <cylinderGeometry args={[0.5, 0.4, 0.8, 12]} />
      </mesh>

      {/* ─── Cockpit Canopy ─── */}
      <mesh position={[0, 0.28, -0.5]} rotation={[-0.2, 0, 0]} material={materials.cockpit}>
        <sphereGeometry args={[0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Cockpit frame ring */}
      <mesh position={[0, 0.22, -0.5]} rotation={[-0.2, 0, 0]} material={materials.accent}>
        <torusGeometry args={[0.25, 0.02, 8, 16]} />
      </mesh>

      {/* ─── Left Wing (swept back) ─── */}
      <group position={[-0.4, -0.05, 0.6]}>
        {/* Wing surface */}
        <mesh rotation={[0, 0.3, -0.05]} material={materials.hull}>
          <boxGeometry args={[1.6, 0.04, 0.7]} />
        </mesh>
        {/* Wing tip accent strip */}
        <mesh position={[-0.75, 0.02, 0.1]} rotation={[0, 0.3, -0.05]} material={materials.accent}>
          <boxGeometry args={[0.12, 0.06, 0.5]} />
        </mesh>
      </group>

      {/* ─── Right Wing (swept back) ─── */}
      <group position={[0.4, -0.05, 0.6]}>
        <mesh rotation={[0, -0.3, 0.05]} material={materials.hull}>
          <boxGeometry args={[1.6, 0.04, 0.7]} />
        </mesh>
        <mesh position={[0.75, 0.02, 0.1]} rotation={[0, -0.3, 0.05]} material={materials.accent}>
          <boxGeometry args={[0.12, 0.06, 0.5]} />
        </mesh>
      </group>

      {/* ─── Vertical Stabilizer (tail fin) ─── */}
      <mesh position={[0, 0.35, 1.4]} rotation={[0.15, 0, 0]} material={materials.hullDark}>
        <boxGeometry args={[0.04, 0.5, 0.6]} />
      </mesh>
      {/* Tail fin tip light */}
      <mesh position={[0, 0.6, 1.3]} material={materials.accent}>
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>

      {/* ─── Engine Nacelles ─── */}
      {/* Left engine */}
      <group position={[-0.5, -0.1, 1.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.hullDark}>
          <cylinderGeometry args={[0.15, 0.18, 0.8, 10]} />
        </mesh>
        {/* Engine intake ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.35]} material={materials.accent}>
          <torusGeometry args={[0.15, 0.02, 8, 12]} />
        </mesh>
        {/* Engine glow core */}
        <mesh position={[0, 0, 0.45]} material={materials.engineGlow}>
          <circleGeometry args={[0.12, 12]} />
        </mesh>
        {/* Exhaust plume */}
        <mesh ref={exhaustLeftRef} position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]} material={materials.exhaustGlow}>
          <coneGeometry args={[0.1, 0.6, 8]} />
        </mesh>
      </group>

      {/* Right engine */}
      <group position={[0.5, -0.1, 1.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.hullDark}>
          <cylinderGeometry args={[0.15, 0.18, 0.8, 10]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.35]} material={materials.accent}>
          <torusGeometry args={[0.15, 0.02, 8, 12]} />
        </mesh>
        <mesh position={[0, 0, 0.45]} material={materials.engineGlow}>
          <circleGeometry args={[0.12, 12]} />
        </mesh>
        <mesh ref={exhaustRightRef} position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]} material={materials.exhaustGlow}>
          <coneGeometry args={[0.1, 0.6, 8]} />
        </mesh>
      </group>

      {/* ─── Hull detail lines ─── */}
      {/* Side panel lines */}
      <mesh position={[0.38, 0, 0]} rotation={[0, 0, 0]} material={materials.hullDark}>
        <boxGeometry args={[0.01, 0.02, 2.5]} />
      </mesh>
      <mesh position={[-0.38, 0, 0]} rotation={[0, 0, 0]} material={materials.hullDark}>
        <boxGeometry args={[0.01, 0.02, 2.5]} />
      </mesh>

      {/* ─── Antenna ─── */}
      <mesh position={[0, 0.15, -1.9]} material={materials.accent}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 4]} />
      </mesh>
      <mesh position={[0, 0.35, -1.9]} material={materials.accent}>
        <sphereGeometry args={[0.02, 6, 6]} />
      </mesh>

      {/* ─── Point light for self-illumination ─── */}
      <pointLight position={[0, 0, 0.5]} intensity={0.3} color="#00f0ff" distance={4} decay={2} />
    </group>
  );
}
