'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import Spaceship from './Spaceship';

/**
 * Maps scrollProgress (0→1) to a path position with FLAT PARKING ZONES at each portal.
 * 
 * Scroll layout:
 *   [0.00 – 0.10]  Fly from start to Portal 1
 *   [0.10 – 0.35]  PARKED at Portal 1 (About)
 *   [0.35 – 0.50]  Fly from Portal 1 to Portal 2
 *   [0.50 – 0.75]  PARKED at Portal 2 (Experience)
 *   [0.75 – 0.90]  Fly from Portal 2 to end zone
 *   [0.90 – 1.00]  PARKED at end zone
 *
 * pathT values correspond to positions on the CatmullRomCurve3:
 *   Portal 1 = 0.25, Portal 2 = 0.50, End = 0.75
 */
function scrollToPathT(scroll: number): number {
  // Segments: [scrollStart, scrollEnd] → [pathStart, pathEnd]
  const segments = [
    [0.00, 0.10, 0.00, 0.25],  // fly to portal 1
    [0.10, 0.35, 0.25, 0.25],  // parked at portal 1
    [0.35, 0.50, 0.25, 0.50],  // fly to portal 2
    [0.50, 0.75, 0.50, 0.50],  // parked at portal 2
    [0.75, 0.90, 0.50, 0.75],  // fly to end
    [0.90, 1.00, 0.75, 0.75],  // parked at end
  ];

  for (const [sStart, sEnd, pStart, pEnd] of segments) {
    if (scroll <= sEnd) {
      const localT = Math.max(0, (scroll - sStart) / (sEnd - sStart));
      // Smooth ease in/out for acceleration/deceleration feel
      const eased = localT * localT * (3 - 2 * localT); // smoothstep
      return pStart + eased * (pEnd - pStart);
    }
  }
  return 0.75;
}

export default function JourneyRig() {
  const { camera, pointer } = useThree();
  const scrollProgress = useStore((state) => state.scrollProgress);
  const shipRef = useRef<THREE.Group>(null);

  // Pre-allocate ALL vectors/quaternions/matrices ONCE — zero GC pressure per frame.
  const _targetPos = useMemo(() => new THREE.Vector3(), []);
  const _tangent = useMemo(() => new THREE.Vector3(), []);
  const _shipTarget = useMemo(() => new THREE.Vector3(), []);
  const _lookAtPos = useMemo(() => new THREE.Vector3(), []);
  const _cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const _cameraLookAt = useMemo(() => new THREE.Vector3(), []);
  const _up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const _quat = useMemo(() => new THREE.Quaternion(), []);
  const _mat = useMemo(() => new THREE.Matrix4(), []);

  // The journey path
  const path = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -100),
      new THREE.Vector3(0, 0, -200),
      new THREE.Vector3(0, 0, -300),
      new THREE.Vector3(0, 0, -400),
    ]);
  }, []);

  useFrame((_state, delta) => {
    if (!shipRef.current) return;

    // Convert scroll progress to path position using the parking waypoint map
    const pathT = scrollToPathT(scrollProgress);
    const t = Math.max(0.001, Math.min(0.999, pathT));

    path.getPointAt(t, _targetPos);
    path.getTangentAt(t, _tangent);

    // Mouse parallax (reduced when parked for stability)
    const px = pointer.x * 2;
    const py = pointer.y * 1;

    _shipTarget.set(_targetPos.x + px, _targetPos.y + py, _targetPos.z);
    shipRef.current.position.lerp(_shipTarget, 5 * delta);

    // Ship rotation
    _lookAtPos.copy(_targetPos).add(_tangent);
    _lookAtPos.x -= pointer.x * 8;
    _lookAtPos.y -= pointer.y * 4;
    _mat.lookAt(shipRef.current.position, _lookAtPos, _up);
    _quat.setFromRotationMatrix(_mat);
    shipRef.current.quaternion.slerp(_quat, 5 * delta);

    // Camera chases the ship
    _cameraTarget.copy(shipRef.current.position);
    _cameraTarget.y += 1.5;
    _cameraTarget.z += 6;
    camera.position.lerp(_cameraTarget, 4 * delta);

    _cameraLookAt.copy(shipRef.current.position);
    _cameraLookAt.z -= 20;
    camera.lookAt(_cameraLookAt);
  });

  return (
    <group ref={shipRef}>
      <Spaceship rotation={[0, Math.PI, 0]} />
    </group>
  );
}
