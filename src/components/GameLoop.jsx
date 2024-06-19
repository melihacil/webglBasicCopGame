import { OrbitControls, useHelper } from "@react-three/drei";
import { useRef, useState } from "react";
import CityScene from "./CityScene";
import Player from "./Player";
import Spawner from "./Spawner";
import * as THREE from "three";


export default function GameLoop({ light, ambient, setScore }) {


  // const shiba = useLoader(GLTFLoader, "../assets/shiba/scene.gltf");
  // USE REDUX FOR COMPONENT FORWARDING LATER ON
  const [isDragging, setDragging] = useState(false);

  const shadowCameraRef = useRef();

  // const light1 = new THREE.DirectionalLight(0xffffff);
  // light1.position.set(1, 1, 1);
  // light1.castShadow = true;
  // light1.shadow.camera.near = 0.01; // same as the camera
  // light1.shadow.camera.far = 1000; // same as the camera
  // light1.shadow.camera.fov = 50; // same as the camera
  // light1.shadow.mapSize.width = 2048;
  // light1.shadow.mapSize.height = 2048;
  useHelper(light, THREE.DirectionalLightHelper);
  useHelper(shadowCameraRef, THREE.CameraHelper);

  return (
    <>
      {/* Camera Controlling Part */}
      {ambient && <ambientLight intensity={0.5} />}
      <directionalLight ref={light} position={[-100, 50, 0]} intensity={1}
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={500}
        shadow-camera-fov={70}


      >
        <perspectiveCamera ref={shadowCameraRef} attach="shadow-camera" />
      </directionalLight>
      {!isDragging && <OrbitControls />}


      {/* City, Roads, Cars Will Go here */}
      <CityScene setDragging={setDragging} />

      <Player />

      <Spawner setScore={setScore} />



    </>
  );
};

//Unnecessary code
{/* 

shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}


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