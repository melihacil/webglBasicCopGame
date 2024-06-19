import React, { useEffect, useRef, forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

const Car = forwardRef(({ modelLocation, modelPosition, ...props }, ref) => {
    const car = useGLTF(modelLocation);
    const internalRef = useRef();

    useEffect(() => {
        const currentRef = ref || internalRef;
        if (currentRef.current) {
            currentRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }, [ref]);

    return (
        <RigidBody>
            <primitive
                object={car.scene}
                ref={ref || internalRef}
                scale={4.0}
                position={modelPosition}
                {...props}
            />
        </RigidBody>
    );
});

export default Car;

export function PoliceCar() {
    return <Car modelLocation="/assets/car/policeCarV1.glb" modelPosition={[0, 3, -30]} />;
}