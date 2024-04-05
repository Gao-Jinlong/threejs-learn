import * as THREE from "three";
import { useCallback, useEffect, useState } from "react";
import React from "react";

export default function useTHREEScene(props: {
  container: React.RefObject<HTMLDivElement>;
}) {
  THREE.Cache.enabled = true;

  const { container } = props;

  const [renderer] = useState(new THREE.WebGLRenderer({ antialias: true }));

  const [camera] = useState(
    new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1500
    )
  );

  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  const [scene] = useState(new THREE.Scene());
  renderer.render(scene, camera);

  animate();
  function animate() {
    requestAnimationFrame(animate);
    renderer?.render(scene, camera);
  }

  const onWindowResize = useCallback(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, [camera, renderer]);

  useEffect(() => {
    // 固定引用，防止清理函数时引用变化导致错误
    const currentContainer = container.current;
    if (currentContainer) {
      currentContainer.appendChild(renderer.domElement);
    }
    onWindowResize();
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [container, onWindowResize, renderer]);

  return {
    scene,
    renderer,
    camera,
  };
}
