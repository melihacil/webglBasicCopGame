import React, { useEffect, useRef, forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

const Car = forwardRef(({ modelLocation, modelPosition, ...props }, ref) => {
    const car = useGLTF(modelLocation);
    const carRef = useRef();

    useEffect(() => {
        if (carRef.current) {
            carRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }, [carRef]);

    // Combine refs: forwarded ref and local ref
    const combinedRef = (node) => {
        if (ref) {
            ref.current = node;
        }
        carRef.current = node;
    };

    return (
        <RigidBody>
            <primitive
                object={car.scene}
                ref={combinedRef}
                scale={4.0}
                position={modelPosition}
                {...props}
            />
        </RigidBody>
    );
});

export default Car;

export function PoliceCar() {
    return <Car modelLocation="/assets/car/policeCarV1.glb" modelPosition={[0, 2, -30]} />;
}