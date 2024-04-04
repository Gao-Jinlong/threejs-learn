import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function RotationCube() {
  const container = useRef<HTMLDivElement>(null);

  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    // 固定引用，防止清理函数时引用变化导致错误
    const currentContainer = container.current;

    if (currentContainer) {
      currentContainer.appendChild(renderer.current.domElement);
    }

    camera.current = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.current.position.set(0, 0, 5);
    camera.current.lookAt(0, 0, 0);

    scene.current = new THREE.Scene();
    renderer.current.render(scene.current, camera.current);

    animate();
    function animate() {
      requestAnimationFrame(animate);
      renderer.current?.render(scene.current!, camera.current!);
    }

    // 清理函数副作用
    return () => {
      if (currentContainer) {
        currentContainer.removeChild(renderer.current!.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const cube = drawRotateCube();
    const line = drawLine();

    scene.current?.add(line, cube);
  }, []);

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
