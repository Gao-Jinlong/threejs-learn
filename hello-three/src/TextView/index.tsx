import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTHREEScene from "../hooks/useTHREEScene";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font, FontLoader } from "three/addons/loaders/FontLoader.js";
import "./index.scss";

export default function TextView() {
  const container = useRef<HTMLDivElement>(null);
  const { scene, camera } = useTHREEScene({ container });

  camera.position.set(0, 400, 700);
  camera.lookAt(0, 150, 0);

  const [text, setText] = useState("Hello, Three.js");
  const [size, setSize] = useState(70);
  const [curveSegments, setCurveSegments] = useState(4);
  const [bevelThickness, setBevelThickness] = useState(4);
  const [bevelSize, setBevelSize] = useState(1.5);
  const [bevelEnabled, setBevelEnabled] = useState(true);
  const [fontName, setFontName] = useState("optimer");
  const [fontWeight, setFontWeight] = useState("bold");
  const [hover, setHover] = useState(30);

  const [font, setFont] = useState<Font | null>(null);
  const [group] = useState(() => new THREE.Group());

  group.position.y = 100;

  const targetRotation = useRef(0);
  let targetRotationOnPointerDown = 0;

  let pointerX = 0;
  let pointerXOnPointerDown = 0;

  let windowHalfX = window.innerWidth / 2;

  let fontIndex = 1;

  const textGeo = useMemo(() => {
    if (!font) return null;

    return new TextGeometry(text, {
      font: font,
      size: size,
      curveSegments: curveSegments,

      bevelEnabled: bevelEnabled,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
    });
  }, [
    bevelEnabled,
    bevelSize,
    bevelThickness,
    curveSegments,
    font,
    size,
    text,
  ]);

  const textMesh = useMemo(() => {
    if (!textGeo) return null;

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
    ];

    const mesh = new THREE.Mesh(textGeo, materials);

    textGeo.computeBoundingBox();

    if (!textGeo.boundingBox) {
      return mesh;
    }

    mesh.position.x =
      -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    mesh.position.y = hover;
    mesh.position.z = 0;

    mesh.rotation.x = 0;
    mesh.rotation.y = Math.PI * 2;

    return mesh;
  }, [hover, textGeo]);

  useEffect(() => {
    if (!textMesh) return;
    group.add(textMesh);
    scene.add(group);

    return () => {
      group.remove(textMesh);
      scene.remove(group);
    };
  }, [group, scene, textMesh]);

  const loadFont = useCallback(() => {
    const loader = new FontLoader();
    const path = "/fonts/" + fontName + "_" + fontWeight + ".typeface.json";

    loader.load(path, function (response) {
      setFont(response);
    });
  }, [fontName, fontWeight]);

  const onPointerDownWrapper = useCallback(onPointerDown, []);
  function onPointerDown(event: PointerEvent) {
    if (event.isPrimary === false) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation.current;

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  }
  function onPointerMove(event: PointerEvent) {
    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;

    targetRotation.current =
      targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
  }
  function onPointerUp(event: PointerEvent) {
    if (event.isPrimary === false) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  }

  useEffect(() => {
    // LIGHTS
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
    pointLight.color.setHSL(Math.random(), 1, 0.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);

    return () => {
      scene.remove(dirLight);
      scene.remove(pointLight);
    };
  }, [scene]);

  useEffect(() => {
    // SCENE
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 250, 1400);

    // BACKGROUND PLANE
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({
        color: 0xaaddff,
        opacity: 1,
        transparent: true,
      })
    );
    plane.position.y = 100;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    return () => {
      scene.remove(plane);
    };
  }, [scene]);

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) {
      return;
    }

    currentContainer.style.touchAction = "none";
    currentContainer.addEventListener("pointerdown", onPointerDownWrapper);

    // currentContainer.addEventListener("keypress", onDocumentKeyPress);
    // currentContainer.addEventListener("keydown", onDocumentKeyDown);

    loadFont();

    return () => {
      currentContainer.removeEventListener("pointerdown", onPointerDownWrapper);
      // currentContainer.removeEventListener("keypress", onDocumentKeyPress);
      // currentContainer.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, [loadFont, onPointerDownWrapper]);

  useEffect(() => {
    animate();
    function animate() {
      requestAnimationFrame(animate);

      render();
    }
    function render() {
      group.rotation.y += (targetRotation.current - group.rotation.y) * 0.05;
    }
  }, [group]);

  return (
    <div ref={container}>
      <div className="text-view-control">
        <div
          className="text-view-control__item"
          onClick={() => {
            setSize(size + 1);
          }}
        >
          fontSize++
        </div>
      </div>
    </div>
  );
}
