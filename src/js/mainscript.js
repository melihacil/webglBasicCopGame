import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { init, camera } from "./CameraControls";
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();

init(renderer, scene);

// camControl.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
// camControl.mouseButtons.LEFT = THREE.MOUSE.PAN;

// KEY CONTROLS USING WASD -> ArrowLeft etc maps it to the arrows
// camControl.keys = {
//   LEFT: "KeyA",
//   UP: "KeyW",
//   BOTTOM: "KeyS",
//   RIGHT: "KeyD",
// };

// camControl.listenToKeyEvents(window);
// camControl.keyPanSpeed = 20;

// Auto rotate if needed
// Beginning of the game may use this
// camControl.autoRotate = true;
// camControl.autoRotateSpeed = 1;

// Saves the state for the camera, can load it back by resetting
// window.addEventListener("keydown", function (e) {
//   if (e.code === "KeyK") {
//     camControl.saveState();
//   }
//   if (e.code === "KeyL") {
//     camControl.reset();
//   }
// });

// camControl.minAzimuthAngle = Math.PI / 4;
// camControl.maxAzimuthAngle = Math.PI / 2;

// Locking vertical angles of rotation
// camControl.minPolarAngle = Math.PI / 4;
// camControl.maxPolarAngle = Math.PI / 2;
// Locks the target to the given coordinates
//camControl.target = new THREE.Vector3(2, 2, 2);

// Initial Camera positioning
camera.position.set(6, 8, 14);
// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
