import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ConveyorBelt = () => {
  const bandRef = useRef();
  const { camera, gl, size } = useThree();
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      gl.setSize(size.width, size.height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, gl, size]);

  useEffect(() => {
    const texture = createTexture();
    const path = new THREE.Path();
    path.absarc(5, 0, 1, Math.PI * 0.5, Math.PI * 1.5, true);
    path.absarc(-5, 0, 1, Math.PI * 1.5, Math.PI * 0.5, true);
    path.closePath();
    const basePts = path.getSpacedPoints(200).reverse();

    const geometry = new THREE.PlaneGeometry(1, 1, 200, 1);
    basePts.forEach((p, idx) => {
      geometry.attributes.position.setXYZ(idx, p.x, p.y, -2);
      geometry.attributes.position.setXYZ(idx + 201, p.x, p.y, 2);
    });

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: texture,
    });

    const band = new THREE.Mesh(geometry, material);
    bandRef.current = band;
    return () => {
      band.geometry.dispose();
      band.material.dispose();
    };
  }, []);

  useFrame(() => {
    if (bandRef.current) {
      bandRef.current.material.map.offset.x = clock.current.getElapsedTime();
      bandRef.current.material.map.needsUpdate = true;
    }
  });

  return (
    <>
      {bandRef.current && <primitive object={bandRef.current} />}
      <OrbitControls />
    </>
  );
};

function createTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'maroon';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineWidth = 100;
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.MirroredRepeatWrapping;
  texture.repeat.set(10, 2);

  return texture;
}

const App = () => (
  <Canvas camera={{ position: [8, 5, 13], fov: 60 }}>
    <ambientLight />
    <ConveyorBelt />
  </Canvas>
);

export default App;

