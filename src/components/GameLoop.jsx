import { Box, OrbitControls, Torus, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RigidBody, quat } from "@react-three/rapier";
import { useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three";

import CityScene from "./CityScene";
import Player from "./Player";


export default function GameLoop({ light, ambient }) {


  // const shiba = useLoader(GLTFLoader, "../assets/shiba/scene.gltf");
  // USE REDUX FOR COMPONENT FORWARDING LATER ON
  const [isDragging, setDragging] = useState(false);

  return (
    <>
      {/* Camera Controlling Part */}
      {ambient && <ambientLight intensity={0.5} />}
      <directionalLight ref={light} position={[-10, 10, 0]} intensity={0.4}
        castShadow={true}
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





    </>
  );
};

//Unnecessary code
{/* <RigidBody
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
          <Box
        position={[2, 3, 0]}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => jump()}
        ref={shibaRef}
        castShadow>
        <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
      </Box>


      <RigidBody type="kinematicPosition" position={[0, 0.75, 0]} ref={kicker}>
        <group position={[3, 3, 3]}>
          <Box args={[5, 0.5, 0.5]} castShadow>
            <meshStandardMaterial color="peachpuff" />
          </Box>
        </group>
      </RigidBody>
    
    
    
    
    */}