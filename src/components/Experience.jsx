import { Box, OrbitControls, Sphere, Torus, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { RigidBody, quat } from "@react-three/rapier";
import { useRef, useState } from "react";
import { Controls } from "../App";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three";

export const Experience = () => {



  // const shiba = useLoader(GLTFLoader, "../assets/shiba/scene.gltf");
  const shiba = useGLTF("/assets/shiba/scene.gltf");

  const shibaRef = useRef();
  const [hover, setHover] = useState(false);
  const cube = useRef();
  const isOnFloor = useRef(true);
  const kicker = useRef();

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
    shibaRef.current.rotateX += 0.1;
    shibaRef.current.rotateY += 0.1;
    shibaRef.current.rotateZ += 0.1;
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
    if (isOnFloor.current) {
      cube.current.applyImpulse({ x: 0, y: 5, z: 0 });
      isOnFloor.current = false;
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />

      <RigidBody position={[-2, 5, 0]} colliders={"ball"}>
        <Sphere >
          <meshStandardMaterial color="pink" />
        </Sphere>
      </RigidBody>


      <RigidBody>
        <Torus position={[1, 2, 0]}>
          <meshStandardMaterial color="yellow" />
        </Torus>
      </RigidBody>
      <RigidBody
        ref={cube}
      >

        <primitive object={shiba.scene} ref={shibaRef} scale={1.0} position={[4, 4, 4]} />
      </RigidBody>
      <Box
        position={[3, 5, 0]}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => jump()}
        ref={shibaRef}>
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
          <Box args={[5, 0.5, 0.5]}>
            <meshStandardMaterial color="peachpuff" />
          </Box>
        </group>
      </RigidBody>


      <RigidBody type="fixed" name="floor" restitution={1}>
        <Box position={[0, 0, 0]} args={[100, 1, 100]}>
          <meshStandardMaterial color="green" />
        </Box>
      </RigidBody>

    </>
  );
};
