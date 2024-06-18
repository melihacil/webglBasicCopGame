import { Box, OrbitControls, Torus, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RigidBody, quat } from "@react-three/rapier";
import { useRef, useState } from "react";
import { Controls } from "../App";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three";

import CityScene from "./CityScene";


export const Experience = ({ light, ambient }) => {


  // const shiba = useLoader(GLTFLoader, "../assets/shiba/scene.gltf");
  const shiba = useGLTF("/assets/shiba/scene.gltf");

  const carModel = useGLTF("/assets/car/policeCarV1.glb").scene;

  const toyotaCar = useGLTF("/assets/car/toyota.glb");
  const shibaRef = useRef();
  const [hover, setHover] = useState(false);
  const { camera } = useThree();
  // USE REDUX FOR COMPONENT FORWARDING LATER ON
  const [isDragging, setDragging] = useState(false);
  const cube = useRef();
  const isOnFloor = useRef(true);
  const kicker = useRef();



  const direction = new THREE.Vector3();
  const right = new THREE.Vector3();
  const forward = new THREE.Vector3();

  camera.getWorldDirection(direction);
  right.setFromMatrixColumn(camera.matrix, 0);
  right.crossVectors(camera.up, direction);
  forward.copy(direction);

  forward.y = 0;
  forward.normalize();
  right.y = 0;
  right.normalize();

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );

  const speed = useRef(5);
  const handleMovement = () => {
    // if (!isOnFloor.current) {
    //   return;
    // }
    if (rightPressed) {
      cube.current.applyImpulse({ x: 0.5, y: 0, z: 0 });
    }
    if (leftPressed) {
      cube.current.applyImpulse({ x: -0.5, y: 0, z: 0 });
    }

    if (forwardPressed) {
      cube.current.applyImpulse({ x: 0, y: 0, z: -0.5 });
    }
    if (backPressed) {
      cube.current.applyImpulse({ x: 0, y: 0, z: 0.5 });
    }
  };
  useFrame((_state, delta) => {
    if (jumpPressed) {
      jump();
      console.log("Player Jumping");
    }
    handleMovement();
    if (isOnFloor.current) {
      console.log("Hey, I'm executing every frame!")
    }
    // const curRotation = quat(kicker.current.rotation());
    // const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
    //   new THREE.Vector3(0, 1, 0),
    //   delta * speed.current
    // );
    // curRotation.multiply(incrementRotation);
    // kicker.current.setNextKinematicRotation(curRotation);

    speed.current += delta;
  });

  const jump = () => {
    //if (isOnFloor.current) {
    cube.current.applyImpulse({ x: 0, y: 1, z: 0 });
    //cube.current.addForce({ x: 0, y: 5, z: 0 });
    isOnFloor.current = false;
    //}
  };

  return (
    <>
      {/* Camera Controlling Part */}
      {ambient && <ambientLight intensity={0.5} />}
      <directionalLight ref={light} position={[-10, 10, 0]} intensity={0.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10} />
      {!isDragging && <OrbitControls />}

      {/* City, Roads, Cars Will Go here */}
      <CityScene setDragging={setDragging} />




      {/* <PoliceCar /> */}
      {/* <RigidBody>
        <Torus position={[1, 2, 0]}>
          <meshStandardMaterial color="yellow" />
        </Torus>
      </RigidBody> */}
      <RigidBody
        ref={cube}
      >

        <primitive object={shiba.scene} ref={shibaRef} scale={1.0} position={[4, 4, 4]} />
      </RigidBody>


      {/* <RigidBody>

        <primitive object={toyotaCar.scene} scale={1.0} position={[4, 4, 4]} />
      </RigidBody> */}


      {/* <primitive object={city.scene} ref={shibaRef} scale={1.0} position={[0, -1, 0]} /> */}
      <Box
        position={[2, 3, 0]}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => jump()}
        ref={shibaRef}
        castShadow>
        <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
      </Box>
      <RigidBody
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject.name === "floor") {
            isOnFloor.current = true;
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject.name === "floor") {
            isOnFloor.current = false;
          }
        }}>
        <Box
          position={[3, 5, 0]}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          onClick={() => jump()}>
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box>
      </RigidBody>

      <RigidBody type="kinematicPosition" position={[0, 0.75, 0]} ref={kicker}>
        <group position={[3, 3, 3]}>
          <Box args={[5, 0.5, 0.5]} castShadow>
            <meshStandardMaterial color="peachpuff" />
          </Box>
        </group>
      </RigidBody>



    </>
  );
};
