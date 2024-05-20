import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
  camera;

  constructor(canvasId, inputs) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.inputs = inputs;
    // NOTE: Camera params;
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;
    this.camControl = undefined;
    // NOTE: Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 48;

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(0xfefefe);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    this.camControl = this.controls;
    this.camControl.autoRotateSpeed = 5;
    // ambient light which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    // directional light - parallel sun rays
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    // this.directionalLight.castShadow = true;
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Will remove
    // window.addEventListener('keydown', function (e) {
    //   if (e.code === 'KeyK') {
    //     this.controls.saveState();
    //   }
    //   if (e.code === 'KeyL') {
    //     this.controls.reset();
    //   }
    //   // if (e.code === 'KeyM') {
    //   //   camControl.autoRotate = !camControl.autoRotate;
    //   // }
    // });

    this.camControl.keys = {
      LEFT: 'KeyA',
      UP: 'KeyW',
      BOTTOM: 'KeyS',
      RIGHT: 'KeyD',
    };

    this.camControl.listenToKeyEvents(window);
    //this.camControl.listenToKeyEvents(null);
    this.camControl.removeEventListener(window);
    this.camControl.keyPanSpeed = 20;
  }
  animate() {
    const cameraStates = this.controls;
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
    this.controls.update();
    if (this.inputs.keys.buttonK) {
      console.log('Saving camera state');
      cameraStates.saveState();
    }
    if (this.inputs.keys.buttonL) {
      console.log('Resetting camera state');
      cameraStates.reset();
    }
    this.inputs.keys.buttonM
      ? (this.camControl.autoRotate = true)
      : (this.camControl.autoRotate = false);
    // if (this.inputs.keys.buttonM) {
    //   console.log('User pressed mmm');

    //   this.camControl.autoRotate = !this.camControl.autoRotate;
    // }
  }

  render() {
    // NOTE: Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
