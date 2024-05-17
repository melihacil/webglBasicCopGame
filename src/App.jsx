import { useEffect } from 'react';

import * as THREE from 'three';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './lib/SceneInit';
import { camera, init } from './scripts/CameraControls';


function App() {
  useEffect(() => {


    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // const boxGeometry = new THREE.BoxGeometry(8, 8, 8);
    // const boxMaterial = new THREE.MeshNormalMaterial();
    // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    // test.scene.add(boxMesh);

    let loadedModel;
    const glftLoader = new GLTFLoader();
    glftLoader.load('./assets/shiba/scene.gltf', (gltfScene) => {
      loadedModel = gltfScene;
      // console.log(loadedModel);

      gltfScene.scene.rotation.y = Math.PI / 8;
      gltfScene.scene.position.y = 5;
      gltfScene.scene.scale.set(10, 10, 10);
      test.scene.add(gltfScene.scene);

      const gltfAnimations = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap = new Map()
      gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a))
      })

      characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle')
    });

    const soldierModel = new GLTFLoader();
    soldierModel.load('./assets/soldier/Soldier.glb', (gltfScene) => {
      const model = gltfScene.scene;
      model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
      });
      test.scene.add(model);

    })

    const gridHelper = new THREE.GridHelper(12, 12);
    test.scene.add(gridHelper);

    // Sets the x, y, and z axes with each having a length of 4
    const axesHelper = new THREE.AxesHelper(12);
    test.scene.add(axesHelper);
    const animate = () => {
      if (loadedModel) {
        loadedModel.scene.rotation.x += 0.01;
        loadedModel.scene.rotation.y += 0.01;
        loadedModel.scene.rotation.z += 0.01;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
