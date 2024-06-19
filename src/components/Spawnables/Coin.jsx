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



// // useFrame((_state, delta) => {
// //     if (mixer.current) mixer.current.update(delta);

// //     // Calculate the new position for the circular path
// //     const prevX = group.current.translation().x;
// //     const prevZ = group.current.translation().z;

// //     const x = startPosition[0] + radius * Math.cos(angle);
// //     const z = startPosition[2] + radius * Math.sin(angle);

// //     // Update the position of the RigidBody
// //     group.current.setTranslation(x, startPosition[1], z);

// //     // Calculate the direction vector
// //     const direction = new THREE.Vector3(x - prevX, 0, z - prevZ).normalize();

// //     // Calculate the rotation angle (in radians) from the direction vector
// //     const rotationAngle = Math.atan2(direction.x, direction.z);

// //     // Update the rotation of the RigidBody to face the moving direction
// //     group.current.setRotation({
// //         x: 0,
// //         y: rotationAngle,
// //         z: 0
// //     });

// //     // Update the angle for the next frame
// //     setAngle(prevAngle => prevAngle + speed);
// // });