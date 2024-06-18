import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import Car, { PoliceCar } from "./Car";

export default function CityScene() {
    const city = useGLTF("/assets/City/test.glb");

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

    return (<>
        <RigidBody type="fixed" colliders="hull">
            <primitive object={scene} ref={cityRef} scale={1.0} position={[0, -1, 0]} />
        </RigidBody>
        <PoliceCar />
    </>
    );
}
