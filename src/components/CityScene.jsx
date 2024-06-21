import React, { useEffect, useRef } from 'react';
import { Sphere, Box, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import DraggableObject from "./Spawnables/DraggableObject.jsx";
// import { PoliceCar } from "./Spawnables/Car.jsx";
import DraggablePhysicsObj from "./Spawnables/DraggablePhysicsObj.jsx";
import DraggableBox from "./Spawnables/DraggableBox.jsx";
import * as THREE from "three";

export default function CityScene({ setDragging, yAxisLocked }) {
    //const city = useGLTF("/assets/City/test.glb");
    const { scene } = useGLTF('/assets/City/test.glb');
    const citySurrounding1 = useGLTF('/assets/City/citySurrounding2.glb');
    const cityRef = useRef();
    const surroundings = useRef();


    useEffect(() => {
        if (cityRef.current) {
            cityRef.current.traverse((child) => {
                if (child.isMesh) {
                    // Set up any additional properties or behaviors for the mesh collider
                    // For example, you can set the material or modify geometry here
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }

        if (surroundings.current) {
            surroundings.current.traverse((child) => {
                if (child.isMesh) {
                    // Set up any additional properties or behaviors for the mesh collider
                    // For example, you can set the material or modify geometry here
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }

    }, []);

    // useLayoutEffect(() => scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), [])

    return (<>

        <primitive object={citySurrounding1.scene} ref={surroundings} scale={1.0} />

        <RigidBody type="fixed" colliders="hull">
            <primitive object={scene} ref={cityRef} scale={1.0} position={[0, -1.5, 0]} />
        </RigidBody>

        <DraggableBox startDragging={setDragging} />

        {/* <DraggableObject startDragging={setDragging} modelLocation="/assets/car/policeCarV1.glb" initialPosition={[0, 2, 20]} /> */}
        <DraggableObject startDragging={setDragging} modelLocation="/assets/car/toyota.glb" initialPosition={[30, 0.8, -65]} scale={1.0} />
        <DraggablePhysicsObj
            modelLocation="/assets/car/policeCarV2.glb"
            initialPosition={[-25, 5, 6]}
            startDragging={setDragging}
            scale={3}
            yAxisLocked={yAxisLocked}
        />
        <DraggablePhysicsObj
            modelLocation="/assets/car/car2.glb"
            initialPosition={[50, 5, 26]}
            startDragging={setDragging}
            scale={6}
            yAxisLocked={yAxisLocked}

        />


        <DraggablePhysicsObj
            modelLocation="/assets/car/car1.glb"
            initialPosition={[30, 5, 9]}
            startDragging={setDragging}
            scale={6}
            yAxisLocked={yAxisLocked}

        />
        <DraggablePhysicsObj
            modelLocation="/assets/car/car4.glb"
            initialPosition={[-30, 6, -20]}
            startDragging={setDragging}
            scale={12}
            yAxisLocked={yAxisLocked}

        />
        <DraggablePhysicsObj
            modelLocation="/assets/car/car3.glb"
            initialPosition={[-25, 5, -6]}
            startDragging={setDragging}
            scale={6}
            yAxisLocked={yAxisLocked}

        />
        <DraggablePhysicsObj
            modelLocation="/assets/shiba/scene.gltf"
            initialPosition={[25, 5, 6]}
            startDragging={setDragging}
            scale={6}
            yAxisLocked={yAxisLocked}

        />
        <DraggablePhysicsObj
            modelLocation="/assets/car/policeCarV1.glb"
            initialPosition={[12, 5, 6]}
            startDragging={setDragging}
            yAxisLocked={yAxisLocked}

        />

        <RigidBody position={[-2, 5, 0]} colliders={"ball"}>
            <Sphere >
                <meshStandardMaterial color="pink" />
            </Sphere>
        </RigidBody>
        {/* <mesh position={[0, 3, 0]} size={[100, 2, 100]} receiveShadow>

            <shadowMaterial transparent opacity={0.2} />
        </mesh> */}

        <RigidBody type="fixed" name="floor" restitution={1}>
            <mesh receiveShadow castShadow rotation={[- Math.PI / 2, 0, 0]}>
                {/* Plane geometry with custom arguments for flat floor */}
                <planeGeometry args={[100, 120]} position={[0, 2, 0]} />
                <meshStandardMaterial color="green" />
            </mesh>
        </RigidBody>

        {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 0]} receiveShadow>
            <meshStandardMaterial color="pink" />

            <planeGeometry args={[100, 100]} />
            <shadowMaterial transparent opacity={0.4} />
        </mesh> */}
    </>
    );
}

useGLTF.preload('/assets/City/test.glb');
useGLTF.preload('/assets/City/citySurrounding1.glb');

useGLTF.preload('/assets/car/policeCarV2.glb');
useGLTF.preload('/assets/car/policeCarV1.glb');
useGLTF.preload('/assets/car/car1.glb');
useGLTF.preload('/assets/car/car2.glb');
useGLTF.preload('/assets/car/car3.glb');
useGLTF.preload('/assets/car/car4.glb');

useGLTF.preload('/assets/shiba/scene.gltf');
useGLTF.preload('/assets/car/toyota.glb');