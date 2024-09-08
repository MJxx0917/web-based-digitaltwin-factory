import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PickUpMachine from '../model/PickUpMachine';  // Import the PickUpMachine component
import Object from '../model/object';      // Import the Object component

export default function ThreeJSWorld() {
  return (
    <Canvas>
      {/* Add ambient and point lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Enable OrbitControls for camera interaction */}
      <OrbitControls />

      {/* Render the PickUpMachine component */}
      <PickUpMachine />

      {/* Render the Object component */}
      <Object />
    </Canvas>
  );
}

