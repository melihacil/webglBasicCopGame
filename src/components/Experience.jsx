import { Box, OrbitControls, Torus, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RigidBody, quat } from "@react-three/rapier";
import { useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three";

import CityScene from "./CityScene";
import Player from "./Player";


export const Experience = ({ light, ambient }) => {


  // const shiba = useLoader(GLTFLoader, "../assets/shiba/scene.gltf");

  const carModel = useGLTF("/assets/car/policeCarV1.glb").scene;

  const toyotaCar = useGLTF("/assets/car/toyota.glb");
  const shibaRef = useRef();
  const [hover, setHover] = useState(false);
  const { camera } = useThree();
  // USE REDUX FOR COMPONENT FORWARDING LATER ON
  const [isDragging, setDragging] = useState(false);

  const kicker = useRef();



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

      <Player />


      {/* <PoliceCar /> */}
      {/* <RigidBody>
        <Torus position={[1, 2, 0]}>
          <meshStandardMaterial color="yellow" />
        </Torus>
      </RigidBody> */}



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
