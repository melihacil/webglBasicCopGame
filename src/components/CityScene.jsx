import React, { useEffect, useRef } from 'react';
import { Sphere, Box, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import DraggableObject from "./Spawnables/DraggableObject.jsx";
// import { PoliceCar } from "./Spawnables/Car.jsx";
import DraggablePhysicsObj from "./Spawnables/DraggablePhysicsObj.jsx";
import DraggableBox from "./Spawnables/DraggableBox.jsx";

export default function CityScene({ setDragging }) {
    //const city = useGLTF("/assets/City/test.glb");
    const { scene } = useGLTF('/assets/City/test.glb');
    const cityRef = useRef();

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
    }, []);

    // useLayoutEffect(() => scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), [])

    return (<>
        <RigidBody type="fixed" colliders="hull">
            <primitive object={scene} ref={cityRef} scale={1.0} position={[0, -1, 0]} />
        </RigidBody>

        <DraggableBox startDragging={setDragging} />

        {/* <DraggableObject startDragging={setDragging} modelLocation="/assets/car/policeCarV1.glb" initialPosition={[0, 2, 20]} /> */}
        <DraggableObject startDragging={setDragging} modelLocation="/assets/car/toyota.glb" initialPosition={[30, 0.8, -65]} scale={1.0} />
        <DraggablePhysicsObj
            modelLocation="/assets/car/policeCarV2.glb"
            initialPosition={[6, 5, 6]}
            startDragging={setDragging}
        />


        <DraggablePhysicsObj
            modelLocation="/assets/car/policeCarV1.glb"
            initialPosition={[12, 5, 6]}
            startDragging={setDragging}
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
                <planeGeometry args={[100, 100]} />
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
