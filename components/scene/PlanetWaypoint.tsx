'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// PlanetWaypoint (Placeholder)
// Represents a destination on the journey (e.g. About, Experience).
// A slow-spinning sphere with a glowing atmosphere ring.

interface PlanetWaypointProps extends React.ComponentPropsWithoutRef<'group'> {
  color?: string;
}

export default function PlanetWaypoint({ color = "#4488ff", ...props }: PlanetWaypointProps) {
  const planetRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={planetRef} {...props}>
      {/* Core Planet */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.7} 
          metalness={0.2} 
        />
      </mesh>
      
      {/* Atmosphere / Glow Ring */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
