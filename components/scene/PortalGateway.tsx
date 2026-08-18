'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface PortalGatewayProps {
  position: [number, number, number];
  color: string;
  label: string;
}

// A lightweight portal gateway — NO MeshPortalMaterial (too expensive, causes extra render passes).
// Instead we use simple glowing torus rings + bloom to create the portal illusion.
export default function PortalGateway({ position, color, label }: PortalGatewayProps) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Spin each ring on a different axis for a gyroscopic look
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.3;
      outerRingRef.current.rotation.y += delta * 0.15;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y -= delta * 0.25;
      midRingRef.current.rotation.z += delta * 0.2;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x -= delta * 0.15;
      innerRingRef.current.rotation.z -= delta * 0.35;
    }
  });

  return (
    <group position={position}>
      {/* Outer spinning ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[10, 0.08, 16, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Mid spinning ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[9, 0.12, 16, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Inner solid ring — the actual portal frame. toneMapped={false} makes it bloom. */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[8, 0.25, 24, 80]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Center glow disc — a simple transparent circle to suggest the "gateway" */}
      <mesh>
        <circleGeometry args={[7.5, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 12, 0]}
        fontSize={1.8}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        {label}
      </Text>
    </group>
  );
}
