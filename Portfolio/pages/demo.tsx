import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreePage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    // Create a scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Move the camera back so we can see the cube
    camera.position.z = 5;

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}
