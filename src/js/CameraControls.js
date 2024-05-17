import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { log } from "three/examples/jsm/nodes/Nodes.js";

export const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

export function init(renderer, scene) {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // Sets orbit control to move the camera around
  const camControl = new OrbitControls(camera, renderer.domElement);
  // camControl.panSpeed = 2;
  // camControl.rotateSpeed = 2;
  // camControl.maxDistance = 10;
  // camControl.enablePan = false;
  camControl.enableDamping = true;
  camControl.dampingFactor = 0.1;

  // camControl.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
  // camControl.mouseButtons.LEFT = THREE.MOUSE.PAN;

  // KEY CONTROLS USING WASD -> ArrowLeft etc maps it to the arrows
  camControl.keys = {
    LEFT: "KeyA",
    UP: "KeyW",
    BOTTOM: "KeyS",
    RIGHT: "KeyD",
  };

  camControl.listenToKeyEvents(window);
  camControl.keyPanSpeed = 20;

  // Auto rotate if needed
  // Beginning of the game may use this

  // Saves the state for the camera, can load it back by resetting
  window.addEventListener("keydown", function (e) {
    if (e.code === "KeyK") {
      camControl.saveState();
    }
    if (e.code === "KeyL") {
      camControl.reset();
    }
    if (e.code === "KeyM") {
      camControl.autoRotate = !camControl.autoRotate;
    }
  });

  // camControl.minAzimuthAngle = Math.PI / 4;
  // camControl.maxAzimuthAngle = Math.PI / 2;

  // Locking vertical angles of rotation
  //   camControl.minPolarAngle = Math.PI / 4;
  //   camControl.maxPolarAngle = Math.PI / 2;
  // Locks the target to the given coordinates
  //camControl.target = new THREE.Vector3(2, 2, 2);

  // Initial Camera positioning
  camera.position.set(2, 6, 20);
  camControl.autoRotate = true;
  camControl.autoRotateSpeed = 5;
  //   camera.rotation.set(-0.464, 0.39, 0.188);
  //camera.rotateX.apply()
  function animate() {
    //

    camControl.update();
    //console.log(camera.rotation);
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}
