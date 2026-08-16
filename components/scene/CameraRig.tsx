'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

// The CameraRig drives the camera along a Catmull-Rom spline based on scroll progress.
// It also adds subtle mouse-tracking parallax for a more immersive feel.

export default function CameraRig() {
  const { camera, pointer } = useThree();
  const scrollProgress = useStore((state) => state.scrollProgress);
  
  // A dummy object we use to calculate the "ideal" camera position/rotation
  // before smoothly interpolating the actual camera towards it.
  const idealCamera = useMemo(() => new THREE.Object3D(), []);

  // ─── The Journey Spline ───
  // These are the core waypoints the camera will fly through.
  // 0: Start (Launch)
  // 1: About (Planet 1)
  // 2: Experience (Asteroid field / timeline)
  // 3: Projects (Space Station)
  // 4: Skills (Cockpit HUD)
  // 5: Contact (Final destination)
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 6),      // Start
      new THREE.Vector3(-10, 0, -20),    // Curve left towards About
      new THREE.Vector3(-5, -5, -50),    // Dip down into Experience
      new THREE.Vector3(15, 2, -80),     // Sweep right to Projects
      new THREE.Vector3(5, 5, -120),     // Up to Skills
      new THREE.Vector3(0, 0, -160),     // Final approach Contact
    ]);
  }, []);

  // In a cinematic camera path, the camera doesn't just look straight ahead.
  // We use a second spline for the "lookAt" target so it pans smoothly.
  const lookAtCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.3, 0),     // Look at ship initially
      new THREE.Vector3(-15, -2, -30),   // Look at About planet
      new THREE.Vector3(-5, -6, -60),    // Look at Experience timeline
      new THREE.Vector3(20, 0, -90),     // Look at Projects station
      new THREE.Vector3(5, 4, -130),     // Look at Skills HUD
      new THREE.Vector3(0, -2, -180),    // Look at Contact panel
    ]);
  }, []);

  useFrame((state, delta) => {
    // 1. Get position on curve based on scroll (0 to 1)
    // We clamp it slightly so we don't go exactly to 1.0 which can glitch the tangent
    const t = Math.max(0.001, Math.min(0.999, scrollProgress));
    
    // 2. Get the exact position and lookAt target from our splines
    const targetPos = curve.getPointAt(t);
    const lookAtPos = lookAtCurve.getPointAt(t);

    // 3. Apply a subtle parallax offset based on the user's mouse position
    // This gives the scene a "parallax" feel even when not scrolling
    const parallaxX = pointer.x * 0.5;
    const parallaxY = pointer.y * 0.5;

    // 4. Update the ideal camera position
    idealCamera.position.copy(targetPos);
    idealCamera.position.x += parallaxX;
    idealCamera.position.y += parallaxY;
    
    // Make the ideal camera look at our target spline
    idealCamera.lookAt(lookAtPos);

    // 5. Smoothly interpolate the real camera to the ideal camera
    // This provides the "buttery" feel and ensures nothing snaps
    camera.position.lerp(idealCamera.position, 4 * delta);
    camera.quaternion.slerp(idealCamera.quaternion, 4 * delta);
  });

  return null; // This component has no visual output
}
