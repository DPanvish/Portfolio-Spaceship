'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import Spaceship from './Spaceship';

export default function JourneyRig() {
  const { camera, pointer } = useThree();
  const scrollProgress = useStore((state) => state.scrollProgress);
  const shipRef = useRef<THREE.Group>(null);
  const idealCamera = useMemo(() => new THREE.Object3D(), []);
  
  // A single linear path going extremely deep into Z.
  // We will place Portals along this path.
  // 0: Start
  // -100: Portal 1 (About)
  // -200: Portal 2 (Experience)
  // -300: Portal 3 (Projects)
  // -400: End
  const path = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),        
      new THREE.Vector3(0, 0, -100),     
      new THREE.Vector3(0, 0, -200),     
      new THREE.Vector3(0, 0, -300),     
      new THREE.Vector3(0, 0, -400),     
    ]);
  }, []);

  useFrame((state, delta) => {
    if (!shipRef.current) return;
    
    // 1. Get position on curve based on scroll
    // Scroll progress goes from 0 to 1
    const t = Math.max(0.001, Math.min(0.999, scrollProgress));
    
    // 2. Calculate ideal spaceship position
    const targetPos = path.getPointAt(t);
    const tangent = path.getTangentAt(t);
    
    // Add mouse parallax to the ship so it banks and moves slightly
    const parallaxX = pointer.x * 3;
    const parallaxY = pointer.y * 1.5;
    
    const targetPositionWithParallax = new THREE.Vector3(
      targetPos.x + parallaxX, 
      targetPos.y + parallaxY, 
      targetPos.z
    );
    
    // Smoothly interpolate the ship to its position
    shipRef.current.position.lerp(targetPositionWithParallax, 5 * delta);
    
    // Make ship point forward, plus banking based on pointer
    const lookAtPos = targetPos.clone().add(tangent);
    lookAtPos.x -= pointer.x * 10; // Bank into the turn when moving mouse
    lookAtPos.y -= pointer.y * 5; 
    
    const idealQuaternion = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(shipRef.current.position, lookAtPos, new THREE.Vector3(0, 1, 0))
    );
    
    shipRef.current.quaternion.slerp(idealQuaternion, 5 * delta);

    // 3. Camera dynamically chases the ship
    // The camera follows from behind and slightly above
    const cameraOffset = new THREE.Vector3(0, 1.5, 6); 
    idealCamera.position.copy(shipRef.current.position).add(cameraOffset);
    
    // Smoothly interpolate the real camera to the ideal camera position
    camera.position.lerp(idealCamera.position, 4 * delta);
    
    // Camera always looks slightly ahead of the ship
    const cameraLookAt = shipRef.current.position.clone().add(new THREE.Vector3(0, 0, -20));
    camera.lookAt(cameraLookAt);
  });

  return (
    <group ref={shipRef}>
      {/* The spaceship model faces backward natively, so we rotate it 180 degrees */}
      <Spaceship rotation={[0, Math.PI, 0]} />
    </group>
  );
}
