import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import ConveyorBelt from './ConveyorBelt';

const ConveyorScene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <OrbitControls />
      <Physics>  
        <ConveyorBelt />
      </Physics>
    </Canvas>
  );
};

export default ConveyorScene;
