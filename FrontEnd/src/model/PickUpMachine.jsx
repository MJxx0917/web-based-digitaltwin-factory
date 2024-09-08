import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ConveyorWithPhysics = () => {
  const gltf = useLoader(GLTFLoader, '../../public/blender/robot_arm_-_blender_mechanically_rigged.glb');
  
  // Refs for the arms
  const armRef1 = useRef(); // Ref for rotation around Arm_2_3
  const armRef2 = useRef(); // Ref for rotation around Arm_1_4
  
  // Refs for the claws
  const clawRef1 = useRef(); // Ref for Claw_1_0
  const clawRef2 = useRef(); // Ref for Claw_2_1
  
  // States for arm rotations
  const [rotationAngle1, setRotationAngle1] = useState(0);
  const [rotationDirection1, setRotationDirection1] = useState(1);
  const [rotationAngle2, setRotationAngle2] = useState(0);
  const [rotationDirection2, setRotationDirection2] = useState(1);
  
  // States for claw rotations
  const [clawRotation1, setClawRotation1] = useState(0);
  const [clawRotationDirection1, setClawRotationDirection1] = useState(1);
  const [clawRotation2, setClawRotation2] = useState(0);
  const [clawRotationDirection2, setClawRotationDirection2] = useState(1);

  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((object) => {
        // Identify the arm objects
        if (object.name === 'Arm_2_3') {
          armRef1.current = object;
        }
        if (object.name === 'Arm_1_4') {
          armRef2.current = object;
        }

        // Identify the claw objects
        if (object.name === 'Claw_1_0') {
          clawRef1.current = object;
        }
        if (object.name === 'Claw_2_1') {
          clawRef2.current = object;
        }
      });
    }
  }, [gltf]);

  useFrame(() => {
    // Rotation for Arm_2_3
    if (armRef1.current) {
      setRotationAngle1((prevAngle) => {
        const newAngle = prevAngle + (0.01 * rotationDirection1);
        if (newAngle > Math.PI / 2 || newAngle < -Math.PI / 2) {
          setRotationDirection1(-rotationDirection1);
          return prevAngle;
        }
        armRef1.current.rotation.z = newAngle;
        return newAngle;
      });
    }

    // Rotation for Arm_1_4
    if (armRef2.current) {
      setRotationAngle2((prevAngle) => {
        const newAngle = prevAngle + (0.01 * rotationDirection2);
        if (newAngle > Math.PI / 2 || newAngle < -Math.PI / 2) {
          setRotationDirection2(-rotationDirection2);
          return prevAngle;
      }
        armRef2.current.rotation.z = newAngle; 
        return newAngle;
      });
    }

    // Rotation for Claw_1_0
    if (clawRef1.current) {
      setClawRotation1((prevRotation) => {
        const newRotation = prevRotation + (0.01 * clawRotationDirection1);
        if (newRotation > Math.PI / 4 || newRotation < 0) { // Limit to 45 degrees
          setClawRotationDirection1(-clawRotationDirection1);
          return prevRotation;
        }
        clawRef1.current.rotation.z = newRotation; // Adjust axis if necessary
        return newRotation;
      });
    }

    // Rotation for Claw_2_1
    if (clawRef2.current) {
      setClawRotation2((prevRotation) => {
        const newRotation = prevRotation + (0.01 * clawRotationDirection2);
        if (newRotation < -Math.PI / 4 || newRotation > 0) { // Limit to 45 degrees
          setClawRotationDirection2(-clawRotationDirection2);
          return prevRotation;
        }
        clawRef2.current.rotation.z = newRotation; // Adjust axis if necessary
        return newRotation;
      });
    }
  });

  return <primitive object={gltf.scene} />;
};

export default function ConveyorScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls />
      <ConveyorWithPhysics />
    </Canvas>
  );
}

