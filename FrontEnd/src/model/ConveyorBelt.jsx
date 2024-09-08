import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DirectionalLight, SpotLight, RepeatWrapping, CanvasTexture, MeshBasicMaterial, Clock } from 'three';
import * as THREE from 'three';

const ConveyorBelt = () => {
  const { scene } = useThree();
  const beltRef = useRef();
  const gltf = useLoader(GLTFLoader, '../../public/blender/simple_rubber_conveyor.glb');
  const clock = useRef(new Clock());

  // Function to create a canvas texture dynamically
  const createTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Draw texture pattern
    ctx.fillStyle = 'maroon';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineWidth = 100;
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(10, 2);

    return texture;
  };

  useEffect(() => {
    const texture = createTexture(); // Create the texture for the conveyor belt
    console.log('Texture created:', texture);

    if (gltf.scene) {
      gltf.scene.traverse((object) => {
        if (object.name === 'Conveyor01Belt') {
          beltRef.current = object;
          console.log('Applying texture to Conveyor01Belt:', object);

          // Use a simpler material to ensure the texture shows up
          const material = new MeshBasicMaterial({
            map: texture,
          });

          // Apply the material to the conveyor belt object
          object.material = material;
          object.material.map.wrapS = RepeatWrapping;
          object.material.map.wrapT = THREE.MirroredRepeatWrapping;
          object.material.map.repeat.set(4, 4);
          object.material.needsUpdate = true;
          console.log('Material and texture applied:', object.material);
        }
      });
    }

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    const spotLight = new SpotLight(0xffffff, 2, 100, Math.PI / 6, 0.5, 2);
    spotLight.position.set(10, 15, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    return () => {
      scene.remove(directionalLight);
      scene.remove(spotLight);
    };
  }, [gltf, scene]);

  useFrame(() => {
    if (beltRef.current && beltRef.current.material && beltRef.current.material.map) {
      beltRef.current.material.map.offset.x = clock.current.getElapsedTime(); // Animate texture offset using clock
      beltRef.current.material.map.needsUpdate = true;
      console.log('Animating texture offset:', beltRef.current.material.map.offset.x);
    }
  });

  return <primitive object={gltf.scene} position={[20, 1, 2]} scale={[15, 15, 15]} />;
};

export default ConveyorBelt;

