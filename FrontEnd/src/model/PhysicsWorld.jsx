import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ConveyorWithPhysics component
const ConveyorWithPhysics = () => {
  const gltf = useLoader(GLTFLoader, '../../public/blender/robot_arm_-_blender_mechanically_rigged.glb');

  const armRef1 = useRef();
  const armRef2 = useRef();
  const clawRef1 = useRef();
  const clawRef2 = useRef();
  const cubeRef = useRef();

  const [rotationAngle1, setRotationAngle1] = useState(0);
  const [rotationDirection1, setRotationDirection1] = useState(1);
  const [rotationAngle2, setRotationAngle2] = useState(0);
  const [rotationDirection2, setRotationDirection2] = useState(1);

  const [clawRotation1, setClawRotation1] = useState(0);
  const [clawRotationDirection1, setClawRotationDirection1] = useState(1);
  const [clawRotation2, setClawRotation2] = useState(0);
  const [clawRotationDirection2, setClawRotationDirection2] = useState(1);

  const [isHoldingCube, setIsHoldingCube] = useState(false);

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

    if (clawRef1.current) {
      setClawRotation1((prevRotation) => {
        const newRotation = prevRotation + (0.01 * clawRotationDirection1);
        if (newRotation > Math.PI / 4 || newRotation < 0) {
          setClawRotationDirection1(-clawRotationDirection1);
          return prevRotation;
        }
        clawRef1.current.rotation.z = newRotation;
        return newRotation;
      });
    }

    if (clawRef2.current) {
      setClawRotation2((prevRotation) => {
        const newRotation = prevRotation + (0.01 * clawRotationDirection2);
        if (newRotation < -Math.PI / 4 || newRotation > 0) {
          setClawRotationDirection2(-clawRotationDirection2);
          return prevRotation;
        }
        clawRef2.current.rotation.z = newRotation;
        return newRotation;
      });
    }

    // Logic for picking up and dropping the cube
    if (armRef1.current && cubeRef.current) {
      const armPosition = new THREE.Vector3();
      armRef1.current.getWorldPosition(armPosition);
      const cubePosition = new THREE.Vector3();
      cubeRef.current.getWorldPosition(cubePosition);

      const distance = armPosition.distanceTo(cubePosition);

      if (distance < 0.3 && !isHoldingCube) {
        setIsHoldingCube(true);
      }

      if (isHoldingCube) {
        cubeRef.current.position.copy(armPosition);
        if (clawRotation1 === 0 && clawRotation2 === 0) { // Adjust based on claw position
          setIsHoldingCube(false);
        }
      }
    }
  });

  return (
    <>
      <primitive object={gltf.scene} />
      <CustomObject position={[0, 0, 0]} ref={cubeRef} />
    </>
  );
};


// CustomObject component
const CustomObject = forwardRef(({ position }, ref) => {
  const scale = [10,10,10]
  return (
    <mesh position={position} scale={scale} ref={ref}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
});

//const position = [20, 1, 30];
//const scale = [2,2,2]

const ConveyorBelt = () => {
  const gltf = useLoader(GLTFLoader, '../../public/blender/simple_rubber_conveyor.glb');
  const beltRef = useRef();

  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((object) => {
        if (object.name === 'Conveyor01Belt') {
          beltRef.current = object;

          // Log children to confirm their material properties
          object.children.forEach((child) => {
            console.log("Child material:", child.material);

            if (child.material) {
              console.log('Original material properties:', child.material);
              child.material.color.set('blue');
              child.material.envMapIntensity = 0;
              child.material.metalness = 0;
              child.material.roughness = 1;
              child.material.needsUpdate = true;
            } else {
              console.log('Child has no material, creating a new one.');
              // Assign a new material if none exists
              child.material = new THREE.MeshStandardMaterial({ color: 'blue' });
            }
          });

          // In case Conveyor01Belt itself needs a default material
          if (object.children.length === 0 && !object.material) {
            console.log('Conveyor01Belt has no material, creating a new one.');
            object.material = new THREE.MeshStandardMaterial({ color: 'blue' });
          }
        }
      });
    }
  }, [gltf]);

  useFrame(() => {
    if (beltRef.current) {
      beltRef.current.position.z -= 0.01;

      if (beltRef.current.position.z < -0.02) {
        beltRef.current.position.z = 0.02;
      }
    }
  });

  const position = [20,1,2]
  const scale = [15,15,15]

  return <primitive object={gltf.scene} position={position} scale={scale} />;
};


// Main scene component
export default function ConveyorScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls />
      <ConveyorWithPhysics />
      <CustomObject />
      <ConveyorBelt />
    </Canvas>
  );
}

