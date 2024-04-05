import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import useTHREEScene from "../hooks/useTHREEScene";

export default function RotationCube() {
  const container = useRef<HTMLDivElement>(null);

  const { scene } = useTHREEScene({ container });

  useEffect(() => {
    const cube = drawRotateCube();
    const line = drawLine();

    scene.add(line, cube);

    return () => {
      scene.remove(line, cube);
    };
  }, [scene]);

  function drawRotateCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    animate();

    return cube;
  }

  function drawLine() {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const points = [];
    points.push(new THREE.Vector3(-1, 0, 0));
    points.push(new THREE.Vector3(0, 1, 0));
    points.push(new THREE.Vector3(1, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    return line;
  }

  return <div ref={container} />;
}
