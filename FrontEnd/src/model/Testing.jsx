import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import { useBox, Physics, usePlane } from '@react-three/cannon';
import * as THREE from 'three';

// Ground component to prevent infinite falling
const Ground = () => {
  const [ref] = usePlane(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0]
  }));

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
};

// ConveyorWithPhysics component
const ConveyorWithPhysics = () => {
  const gltf = useLoader(GLTFLoader, '/blender/robot_arm_-_blender_mechanically_rigged.glb');

  const [rotationAngle1, setRotationAngle1] = useState(0);
  const [rotationDirection1, setRotationDirection1] = useState(1);
  const [rotationAngle2, setRotationAngle2] = useState(0);
  const [rotationDirection2, setRotationDirection2] = useState(1);

  const [clawRotation1, setClawRotation1] = useState(0);
  const [clawRotationDirection1, setClawRotationDirection1] = useState(1);
  const [clawRotation2, setClawRotation2] = useState(0);
  const [clawRotationDirection2, setClawRotationDirection2] = useState(1);

  const armRef1 = useRef();
  const armRef2 = useRef();
  const clawRef1 = useRef();
  const clawRef2 = useRef();
  const [cubeRef, cubeApi] = useBox(() => ({
    mass: 1,
    position: [1, -1, 4],
  }));

  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((object) => {
        if (object.name === 'Arm_2_3') armRef1.current = object;
        if (object.name === 'Arm_1_4') armRef2.current = object;
        if (object.name === 'Claw_1_0') clawRef1.current = object;
        if (object.name === 'Claw_2_1') clawRef2.current = object;
      });
    }
  }, [gltf]);

  useFrame(() => {
    // Arm and claw rotation logic
    if (armRef1.current) {
      const newAngle = rotationAngle1 + 0.01 * rotationDirection1;
      if (newAngle > Math.PI / 2 || newAngle < -Math.PI / 2) {
        setRotationDirection1(-rotationDirection1);
      }
      setRotationAngle1(newAngle);
      armRef1.current.rotation.z = newAngle;
    }

    if (armRef2.current) {
      const newAngle = rotationAngle2 + 0.01 * rotationDirection2;
      if (newAngle > Math.PI / 2 || newAngle < -Math.PI / 2) {
        setRotationDirection2(-rotationDirection2);
      }
      setRotationAngle2(newAngle);
      armRef2.current.rotation.z = newAngle;
    }

    if (clawRef1.current) {
      const newRotation = clawRotation1 + 0.01 * clawRotationDirection1;
      if (newRotation > Math.PI / 4 || newRotation < 0) {
        setClawRotationDirection1(-clawRotationDirection1);
      }
      setClawRotation1(newRotation);
      clawRef1.current.rotation.z = newRotation;
    }

    if (clawRef2.current) {
      const newRotation = clawRotation2 + 0.01 * clawRotationDirection2;
      if (newRotation < -Math.PI / 4 || newRotation > 0) {
        setClawRotationDirection2(-clawRotationDirection2);
      }
      setClawRotation2(newRotation);
      clawRef2.current.rotation.z = newRotation;
    }

    // Calculate and log the distance between the cube and the ground
    const clawPos1 = clawRef1.current.getWorldPosition(new THREE.Vector3());
    const clawPos2 = clawRef2.current.getWorldPosition(new THREE.Vector3());
    const cubePos = cubeRef.current.position;
    const distance1 = clawPos1.distanceTo(cubePos);
    const distance2 = clawPos2.distanceTo(cubePos);

    // Calculate distance from claws to the ground
    const groundHeight = 0; // Assuming ground is at y = 0
    const claw1ToGround = clawPos1.y - groundHeight;
    const claw2ToGround = clawPos2.y - groundHeight;

    console.log(`Distance from Claw 1 to Ground: ${claw1ToGround}`);
    console.log(`Distance from Claw 2 to Ground: ${claw2ToGround}`);

    // Condition to move the cube up
    if ((distance1 >= 4 && distance1 <= 5) || (distance2 >= 4 && distance2 <= 5)) {
      cubeApi.position.set(cubePos.x, cubePos.y + 0.02, cubePos.z);
    }

    /*
     if (claw1ToGround > 22 || claw2ToGround > 22) {
      cubeApi.position.set(cubePos.x, cubePos.y - 0.02, cubePos.z);
    }
    */
  });

  return (
    <>
      <Ground />
      <primitive object={gltf.scene} position={[0, 7, 0]} rotation={[0, Math.PI/4, 0]} />
      <mesh ref={cubeRef} scale={[30, 30, 30]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
};

// Main scene component wrapped in Physics context
export default function ConveyorScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls />
      <Physics>
        <ConveyorWithPhysics />
      </Physics>
    </Canvas>
  );
}

