import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

function LensMesh({ scale = 0.15 }) {
  const ref = useRef();
  const { viewport: vp, pointer } = useThree();

  useFrame((state, delta) => {
    const destX = (pointer.x * vp.width) / 2;
    const destY = (pointer.y * vp.height) / 2;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
  });

  return (
    <mesh ref={ref} scale={scale} rotation-x={Math.PI / 2}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        ior={1.2}
        thickness={1.5}
        anisotropy={0.1}
        chromaticAberration={0.04}
        distortion={0}
        distortionScale={0}
        temporalDistortion={0}
        resolution={256}
        transmission={1}
        opacity={1}
        transparent={true}
        color="#ffffff"
      />
    </mesh>
  );
}

export default function GlobalGlassCursor() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <Canvas eventSource={document.getElementById('root')} eventPrefix="client" camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        <LensMesh />
      </Canvas>
    </div>
  );
}
