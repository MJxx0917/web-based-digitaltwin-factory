import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ConveyorWithPhysics = () => {
  const gltf = useLoader(GLTFLoader, '../../public/blender/conveyor_belt.glb');
  const beltRef = useRef();

  useEffect(() => {
    if (gltf.scene) {
      const beltMesh = gltf.scene.getObjectByName('Object'); // Replace with correct object name
      if (beltMesh) {
        beltRef.current = beltMesh;

        if (beltMesh.material && beltMesh.material.map) {
          beltMesh.material.map.wrapS = THREE.RepeatWrapping;
          beltMesh.material.map.wrapT = THREE.RepeatWrapping;
        } else if (beltMesh.material) {
          const textureLoader = new THREE.TextureLoader();
          const defaultTexture = textureLoader.load('/path/to/your/default/texture.jpg');
          defaultTexture.wrapS = THREE.RepeatWrapping;
          defaultTexture.wrapT = THREE.RepeatWrapping;
          beltMesh.material.map = defaultTexture;
          console.warn('No material map found, assigned default texture');
        } else {
          console.warn('Belt mesh material not found');
        }
      } else {
        console.warn('Belt mesh not found');
      }
    }
  }, [gltf.scene]);

  useFrame((state, delta) => {
    if (beltRef.current && beltRef.current.material && beltRef.current.material.map) {
      beltRef.current.material.map.offset.y -= delta * 0.5; // Adjust the speed as necessary
    }
  });

  return <primitive object={gltf.scene} />;
};

const PickUpMachine = ({ rotation, armExtension, scale, position }) => {
  const gltf = useLoader(GLTFLoader, '../../public/blender/robotic_manipulator.glb');
  const [armGroup, setArmGroup] = useState(null);

  useEffect(() => {
    if (gltf.scene) {
      const foundArmGroup = gltf.scene.getObjectByName('geo'); 
      if (foundArmGroup) {
        setArmGroup(foundArmGroup);
      } else {
        const firstGroup = gltf.scene.children.find(child => child.isGroup);
        if (firstGroup) {
          setArmGroup(firstGroup);
        }
      }
    }
  }, [gltf.scene]);

  useEffect(() => {
    if (armGroup) {
      armGroup.children.forEach(child => {
        if (child.name.startsWith('Cylinder001')) {
          child.scale.y = 0.8 + armExtension; 
        }
      });
    }
  }, [armGroup, armExtension]);

  return (
    <primitive
      object={gltf.scene}
      rotation={rotation}
      scale={scale} // Adjusted scale
      position={position} // Adjusted position
    />
  );
};

// Inside the FactoryScene component
export default function FactoryScene() {
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [direction, setDirection] = useState(1);
  const [armExtension, setArmExtension] = useState(0);
  const [extensionDirection, setExtensionDirection] = useState(1);

  useEffect(() => {
    const rotationSpeed = 0.005; // Adjust this for smoother rotation
    const rotationLimit = Math.PI / 2; // 90 degrees in radians

    const rotationInterval = setInterval(() => {
      setRotation(prevRotation => {
        const newRotation = prevRotation[1] + direction * rotationSpeed;

        // Reverse direction when the rotation reaches the limits of -90 or +90 degrees
        if (newRotation > rotationLimit || newRotation < -rotationLimit) {
          setDirection(-direction);
        }

        return [prevRotation[0], newRotation, prevRotation[2]];
      });
    }, 16); // 16ms for approximately 60 FPS

    return () => {
      clearInterval(rotationInterval);
    };
  }, [direction]);

  useEffect(() => {
    const armSpeed = 0.1;
    const extensionLimit = 2;

    const armMovementInterval = setInterval(() => {
      setArmExtension(prevExtension => {
        if (prevExtension > extensionLimit) {
          setExtensionDirection(-1);
        } else if (prevExtension < 0) {
          setExtensionDirection(1);
        }
        return prevExtension + extensionDirection * armSpeed;
      });
    }, 200);

    return () => {
      clearInterval(armMovementInterval);
    };
  }, [extensionDirection]);

return (
    <Canvas
      className="bg-gray-500"
      gl={{ antialias: true }}
      camera={{ position: [0, 5, 10] }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color(0x808080);
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls />
      <ConveyorWithPhysics position={[0, 0, 0]} />
      <PickUpMachine 
        position={[0, -2.5, -195]}
        rotation={rotation} 
        armExtension={armExtension} 
        scale={[6, 6, 6]} 
      />
    </Canvas>
  );
}
