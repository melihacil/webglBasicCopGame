import { Box, OrbitControls, Sphere, Torus, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RigidBody, quat } from "@react-three/rapier";
import { useRef, useState } from "react";
import { Controls } from "../App";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three";
import DraggableBox from "./DraggableBox";
import CityScene from "./CityScene";

export const Experience = ({ light, ambient }) => {
  const shiba = useGLTF("/assets/police/scene.gltf");
  const shibaRef = useRef();
  const [hover, setHover] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const cube = useRef();
  const isOnFloor = useRef(true);
  const kicker = useRef();
  const { camera } = useThree();

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

  const speed = useRef(5);

  const handleMovement = () => {
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

    if (rightPressed) {
      cube.current.applyImpulse(right.multiplyScalar(-0.5));
    }
    if (leftPressed) {
      cube.current.applyImpulse(right.multiplyScalar(0.5));
    }
    if (forwardPressed) {
      cube.current.applyImpulse(forward.multiplyScalar(0.5));
    }
    if (backPressed) {
      cube.current.applyImpulse(forward.multiplyScalar(-0.5));
    }
  };

  useFrame((_state, delta) => {
    if (jumpPressed && isOnFloor.current) {
      jump();
      console.log("Player Jumping");
    }
    handleMovement();
    if (isOnFloor.current) {
      console.log("Hey, I'm executing every frame!")
    }
    shibaRef.current.rotateX += 0.1;
    shibaRef.current.rotateY += 0.1;
    shibaRef.current.rotateZ += 0.1;

    speed.current += delta;
  });

  const jump = () => {
    cube.current.applyImpulse({ x: 0, y: 1, z: 0 });
    isOnFloor.current = false;
  };

  return (
    <>
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

      <CityScene />

      <RigidBody position={[-2, 5, 0]} colliders={"ball"}>
        <Sphere >
          <meshStandardMaterial color="pink" />
        </Sphere>
      </RigidBody>
      <DraggableBox startDragging={setDragging} />

      <RigidBody ref={cube}>
        <primitive object={shiba.scene} ref={shibaRef} scale={1.0} position={[4, 4, 4]} />
      </RigidBody>
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

      <RigidBody type="fixed" name="floor" restitution={1}>
        <Box position={[0, 0, 0]} args={[100, 2, 100]}>
          <meshStandardMaterial color="green" />
          <mesh receiveShadow />
        </Box>
      </RigidBody>
    </>
  );
};
