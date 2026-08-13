'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Spaceship (Placeholder)
// A procedural geometry placeholder until a real .glb model is added.
// It consists of a sleek cone body and two small swept-back wings.

export default function Spaceship(props: JSX.IntrinsicElements['group']) {
  const shipRef = useRef<THREE.Group>(null);

  // Subtle idle hovering animation
  useFrame((state) => {
    if (shipRef.current) {
      // Gentle bobbing
      shipRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      // Slight pitch correction
      shipRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={shipRef} {...props}>
      {/* Ship Body (Sleek Cone pointing forward (-Z)) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0, 0.5, 3, 8]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Cockpit Glass */}
      <mesh position={[0, 0.25, 0.5]} rotation={[Math.PI / 2.2, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
        <meshStandardMaterial color="#00f0ff" roughness={0.1} metalness={0.9} emissive="#005080" />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-0.8, -0.1, 0.8]} rotation={[0, Math.PI / 8, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#dddddd" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[0.8, -0.1, 0.8]} rotation={[0, -Math.PI / 8, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#dddddd" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Engine Glow (Back) */}
      <mesh position={[0, 0, 1.6]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
    </group>
  );
}
