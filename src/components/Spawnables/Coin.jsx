import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";

export default function CoinPickup({ position, onCollect }) {
    const coinModel = useGLTF("/assets/coin/stylized_coin.glb").scene.clone(); // Replace with the actual path to your coin model
    const coinRef = useRef();
    const [rotY, setRotY] = useState(0);
    const [animSpeed, setAnimSpeed] = useState(1);

    // Spin the coin
    useFrame((state, delta) => {
        if (coinRef.current) {
            // Calculate smooth rotation delta based on animSpeed
            const rotationDelta = delta * animSpeed;

            // Gradually decrease rotation speed as rotY increases
            const slowedDownRotationDelta = rotationDelta * Math.max(0, 1 - (rotY / 30)); // Adjust 30 based on desired deceleration rate

            // Update rotY with the smoothed delta
            setRotY((prev) => prev + slowedDownRotationDelta);

            // Apply smooth rotation using a quaternion with axis and angle
            coinRef.current.setRotation(
                new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY), // Rotate around Y-axis
                true // Local space (relative to the coin's current orientation)
            );
            // Reset rotY when it reaches a certain threshold
            if (rotY > 15) {
                setRotY(0);
            }
        }
    });

    const handleCollision = ({ other }) => {
        const colliderName = other.rigidBodyObject?.name; // Optional chaining to handle undefined object
        console.log("Collider name:", colliderName);
        if (colliderName === 'player') {
            onCollect();
        }
        else {
            console.log("NOT COLLECTED");
        }
    };
    // onCollisionEnter={handleCollision}

    return (
        <RigidBody ref={coinRef}
            position={position}
            onIntersectionEnter={handleCollision}
            type={"fixed"}
            sensor
        >
            <primitive object={coinModel} scale={4} />
        </RigidBody>
    );
}



// 