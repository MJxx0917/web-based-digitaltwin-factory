import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

const Object  = () => {
  const gltf = useLoader(GLTFLoader, '../../public/blender/cube.glb');

  return <primitive object={gltf.scene} />;
};

export default function ConveyorScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls />
      <Object />
    </Canvas>
  );
}

