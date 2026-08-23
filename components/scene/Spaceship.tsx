'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type SpaceshipProps = React.ComponentPropsWithoutRef<'group'>;

export default function Spaceship(props: SpaceshipProps) {
  const shipRef = useRef<THREE.Group>(null);
  const exhaustLeftRef = useRef<THREE.Mesh>(null);
  const exhaustRightRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();

  // Create a smooth aerodynamic curve for the main fuselage
  const fuselagePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20; // 0 to 1
      const y = t * 4 - 2; // -2 to 2 (length 4)
      
      // Aerodynamic profile: sharp nose (t=1, y=2), thicker middle, tapered back
      let r = 0;
      if (t > 0.8) {
        // Nose cone
        r = (1 - t) * 5 * 0.4;
      } else if (t > 0.2) {
        // Main body
        r = 0.4;
      } else {
        // Taper to engines
        r = 0.4 - (0.2 - t) * 1.0;
      }
      
      // Smooth out the sharp edges
      r = Math.max(0.1, r);
      
      points.push(new THREE.Vector2(r, y));
    }
    return points;
  }, []);

  // Premium Sci-Fi Materials
  const materials = useMemo(() => ({
    hullPrimary: new THREE.MeshStandardMaterial({
      color: '#e0e5ff', // Very light silver/white (high visibility)
      roughness: 0.2,
      metalness: 0.8,
      envMapIntensity: 1.5,
    }),
    hullDark: new THREE.MeshStandardMaterial({
      color: '#151820', // Dark contrast panels
      roughness: 0.5,
      metalness: 0.6,
      envMapIntensity: 1.0,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#00aaff',
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.9, // Glass effect
      thickness: 0.5,
      clearcoat: 1.0,
      envMapIntensity: 2.0,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: '#00f0ff',
      emissiveIntensity: 0.8,
    }),
    exhaustGlow: new THREE.MeshBasicMaterial({
      color: '#00f0ff',
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    }),
  }), []);

  // Idle hover + engine pulse
  useFrame((state) => {
    if (!shipRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;

    // Smooth floating
    shipRef.current.position.y = Math.sin(t * 1.5) * 0.1;
    shipRef.current.rotation.z = Math.sin(t * 0.8) * 0.05; // slight roll
    shipRef.current.rotation.x = Math.sin(t * 0.6) * 0.03; // pitch

    // Pulsating engine exhaust
    const pulse = 0.7 + Math.sin(t * 15) * 0.3;
    if (exhaustLeftRef.current) {
      exhaustLeftRef.current.scale.set(1, pulse, 1);
    }
    if (exhaustRightRef.current) {
      exhaustRightRef.current.scale.set(1, pulse, 1);
    }
  });

  return (
    <group ref={shipRef} {...props} scale={0.5}>
      
      {/* ─── Main Fuselage ─── */}
      {/* Rotated so the nose (Y=2) points towards -Z (forward) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.hullPrimary}>
        <latheGeometry args={[fuselagePoints, 32]} />
      </mesh>

      {/* ─── Cockpit Canopy ─── */}
      <mesh position={[0, 0.35, -0.2]} rotation={[-0.1, 0, 0]} material={materials.glass} scale={[1, 0.5, 2]}>
        <sphereGeometry args={[0.3, 32, 16]} />
      </mesh>

      {/* ─── Main Wings (Swept Back) ─── */}
      {/* Left Wing */}
      <group position={[-0.8, 0, 0.5]}>
        {/* We use a thin box for the wing, angled back */}
        <mesh rotation={[0, 0.5, 0]} material={materials.hullPrimary}>
          <boxGeometry args={[1.8, 0.06, 1.2]} />
        </mesh>
        {/* Wing trim / armor plate */}
        <mesh position={[0, 0.04, 0]} rotation={[0, 0.5, 0]} material={materials.hullDark}>
          <boxGeometry args={[1.5, 0.02, 0.8]} />
        </mesh>
        {/* Wingtip glow */}
        <mesh position={[-0.9, 0, 0.5]} rotation={[0, 0.5, 0]} material={materials.accent}>
          <boxGeometry args={[0.06, 0.1, 0.8]} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group position={[0.8, 0, 0.5]}>
        <mesh rotation={[0, -0.5, 0]} material={materials.hullPrimary}>
          <boxGeometry args={[1.8, 0.06, 1.2]} />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[0, -0.5, 0]} material={materials.hullDark}>
          <boxGeometry args={[1.5, 0.02, 0.8]} />
        </mesh>
        <mesh position={[0.9, 0, 0.5]} rotation={[0, -0.5, 0]} material={materials.accent}>
          <boxGeometry args={[0.06, 0.1, 0.8]} />
        </mesh>
      </group>

      {/* ─── Vertical Tail Fin ─── */}
      <group position={[0, 0.6, 1.2]}>
        <mesh rotation={[-0.3, 0, 0]} material={materials.hullPrimary}>
          <boxGeometry args={[0.06, 1.0, 0.8]} />
        </mesh>
        <mesh position={[0, 0.5, 0.3]} material={materials.accent}>
          <boxGeometry args={[0.1, 0.1, 0.2]} />
        </mesh>
      </group>

      {/* ─── Engine Nacelles (Mounted on wings) ─── */}
      
      {/* Left Engine */}
      <group position={[-1.2, -0.1, 0.8]}>
        {/* Engine Casing */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.hullDark}>
          <cylinderGeometry args={[0.25, 0.25, 1.4, 16]} />
        </mesh>
        {/* Front Intake */}
        <mesh position={[0, 0, -0.7]} rotation={[-Math.PI / 2, 0, 0]} material={materials.accent}>
          <torusGeometry args={[0.2, 0.05, 8, 16]} />
        </mesh>
        {/* Exhaust Glow */}
        <mesh ref={exhaustLeftRef} position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]} material={materials.exhaustGlow}>
          <coneGeometry args={[0.22, 1.5, 16]} />
        </mesh>
      </group>

      {/* Right Engine */}
      <group position={[1.2, -0.1, 0.8]}>
        {/* Engine Casing */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.hullDark}>
          <cylinderGeometry args={[0.25, 0.25, 1.4, 16]} />
        </mesh>
        {/* Front Intake */}
        <mesh position={[0, 0, -0.7]} rotation={[-Math.PI / 2, 0, 0]} material={materials.accent}>
          <torusGeometry args={[0.2, 0.05, 8, 16]} />
        </mesh>
        {/* Exhaust Glow */}
        <mesh ref={exhaustRightRef} position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]} material={materials.exhaustGlow}>
          <coneGeometry args={[0.22, 1.5, 16]} />
        </mesh>
      </group>

      {/* ─── Underbelly Details ─── */}
      <mesh position={[0, -0.2, 0.5]} material={materials.hullDark}>
        <boxGeometry args={[0.6, 0.2, 2.0]} />
      </mesh>
      
      {/* Ambient under-glow */}
      <pointLight position={[0, -1, 0]} intensity={2.0} color="#00f0ff" distance={5} decay={2} />

    </group>
  );
}
