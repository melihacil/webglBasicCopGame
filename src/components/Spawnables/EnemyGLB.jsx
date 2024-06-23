import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

const EnemyGLB = ({ modelPath, startPosition = [0, 0, 0], targetPosition = [10, 0, 10], speed = 0.1, onCollect }) => {
    const group = useRef();
    const rbgroup = useRef();

    const model = useLoader(GLTFLoader, modelPath);

    useEffect(() => {
        model.scene.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });

    }, [model]);

    // const [movingToTarget, setMovingToTarget] = useState(true);

    // useFrame((state, delta) => {
    //     // Current position
    //     const currentPosition = rbgroup.current.translation();
    //     const currentPos = new THREE.Vector3(currentPosition.x, currentPosition.y, currentPosition.z);

    //     // Determine target based on the direction
    //     const targetPos = movingToTarget ? new THREE.Vector3(...targetPosition) : new THREE.Vector3(...startPosition);

    //     // Calculate direction
    //     const direction = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();

    //     // Calculate new position
    //     const newPosition = currentPos.add(direction.multiplyScalar(speed));

    //     // Apply translation directly
    //     rbgroup.current.setTranslation({ x: newPosition.x, y: newPosition.y, z: newPosition.z }, true);

    //     // Calculate rotation to face the direction of movement
    //     const angle = Math.atan2(direction.x, direction.z);
    //     const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

    //     // Apply the rotation to the group
    //     group.current.setRotationFromQuaternion(quaternion);

    //     // Check if the enemy has reached the target position
    //     if (currentPos.distanceTo(targetPos) < 0.1) {
    //         setMovingToTarget(!movingToTarget); // Toggle direction
    //     }
    // });

    const handleCollision = ({ other }) => {
        const colliderName = other.rigidBodyObject?.name; // Optional chaining to handle undefined object
        console.log("Collider name:", colliderName);
        if (colliderName === 'player') {
            onCollect();
        }
    };

    return (
        <RigidBody
            type="dynamic"
            position={startPosition}
            lockRotations={true}
            scale={1}
            ref={rbgroup}
            onCollisionEnter={handleCollision}
        >
            <group ref={group}>
                {model && <primitive object={model.scene} />}
            </group>
        </RigidBody>
    );
};

export default EnemyGLB;
