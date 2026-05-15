import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={sphereRef} args={[1.5, 32, 32]}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          wireframe={true}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Inner glowing core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#6366f1"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

export const NetworkGlobe = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-[-1] opacity-70 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} intensity={1} color="#4f46e5" />
        <pointLight position={[-2, -2, -5]} intensity={0.5} color="#ec4899" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
};
