'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshPortalMaterial, Text } from '@react-three/drei';

interface PortalGatewayProps {
  position: [number, number, number];
  color: string;
  label: string;
}

export default function PortalGateway({ position, color, label }: PortalGatewayProps) {
  const portalRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Subtle floating animation for the portal
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Memoize random particle positions to satisfy react-hooks/purity
  const particles = useMemo(() => {
    return [...Array(50)].map(() => [
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      -Math.random() * 50
    ] as [number, number, number]);
  }, []);

  return (
    <group position={position} ref={groupRef}>
      {/* The Portal Frame (Outer glowing ring) */}
      <mesh>
        <torusGeometry args={[8, 0.4, 16, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      
      {/* Outer Glow */}
      <mesh>
        <torusGeometry args={[8, 0.8, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Label Text */}
      <Text
        position={[0, 9, 0]}
        fontSize={1.5}
        color={color}
        anchorX="center"
        anchorY="middle"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDqi1QNTZpo6mTRtMwO0H9_A.woff"
      >
        {label}
      </Text>

      {/* The Actual Portal Content (Using MeshPortalMaterial) */}
      <mesh>
        {/* Fill the inner circle of the torus */}
        <circleGeometry args={[7.8, 64]} />
        <MeshPortalMaterial ref={portalRef} side={THREE.DoubleSide} blend={0.1}>
          {/* Inside the Portal - a different colored sky/environment */}
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={1} />
          
          {/* A cool grid or abstract geometry inside the portal to show depth */}
          <group position={[0, 0, -20]}>
            <mesh>
              <icosahedronGeometry args={[15, 1]} />
              <meshBasicMaterial color={color} wireframe />
            </mesh>
          </group>
          
          {/* Inner particles/stars just for this dimension */}
          <group position={[0, 0, -10]}>
             {particles.map((pos, i) => (
                <mesh key={i} position={pos}>
                  <sphereGeometry args={[0.2, 4, 4]} />
                  <meshBasicMaterial color={color} />
                </mesh>
             ))}
          </group>
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
