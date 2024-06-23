import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { useFBX } from '@react-three/drei';

import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const EnemyFBX = ({ modelPath, animationPath, startPosition = [0, 0, 0], targetPosition = [10, 0, 10], speed = 0.1, onCollect }) => {
    const group = useRef();
    const rbgroup = useRef();

    const mainModel = useFBX(modelPath);


    const model = SkeletonUtils.clone( mainModel );

    useLayoutEffect(() => model.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), []);

    const animation = useLoader(FBXLoader, animationPath);
    const mixer = useRef();
    let velocity;


    const [movingToTarget, setMovingToTarget] = useState(true);

    useEffect(() => {
        if (model) {
            mixer.current = new THREE.AnimationMixer(model);
            const action = mixer.current.clipAction(animation.animations[0]);
            action.play();
            group.current.add(model);
        }
    }, [model, animation]);

    useFrame((state, delta) => {
        if (mixer.current) mixer.current.update(delta);

        // Current position
        const currentPosition = rbgroup.current.translation();
        const currentPos = new THREE.Vector3(currentPosition.x, currentPosition.y, currentPosition.z);

        // Determine target based on the direction
        const targetPos = movingToTarget ? new THREE.Vector3(...targetPosition) : new THREE.Vector3(...startPosition);

        // Calculate direction
        const direction = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();

        // Calculate new position
        const newPosition = currentPos.add(direction.multiplyScalar(speed));

        // Apply translation directly
        rbgroup.current.setTranslation({ x: newPosition.x, y: newPosition.y, z: newPosition.z }, true);

        // Calculate rotation to face the direction of movement
        const lookAt = new THREE.Vector3().copy(direction).normalize();
        // const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), lookAt);


        velocity = rbgroup.current.linvel();

        const angle = Math.atan2(velocity.x, velocity.z);
        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

        group.current.setRotationFromQuaternion(quaternion);



        // Update rotation of the primitive object (assuming it's the first child of group)
        if (group.current.children.length > 0) {
            const primitiveObject = group.current.children[0];
            primitiveObject.rotation.setFromQuaternion(quaternion);

        }

        // Check if the enemy has reached the target position
        if (currentPos.distanceTo(targetPos) < 0.1) {
            setMovingToTarget(!movingToTarget); // Toggle direction
        }
    });


    const handleCollision = ({ other }) => {
        const colliderName = other.rigidBodyObject?.name; // Optional chaining to handle undefined object
        console.log("Collider name:", colliderName);
        if (colliderName === 'player') {
            onCollect();
        }
        else {
            // console.log("NOT COLLECTED");
        }
    };


    // useEffect(() => {
    //     if (rbgroup.current) {
    //         rbgroup.current.body = copiedScene; // Assuming scene contains the physics body
    //     }
    // }, [copiedScene]);


    return (
        <RigidBody
            type="dynamic"
            position={startPosition}
            lockRotations={true}
            scale={0.04}
            ref={rbgroup}
            onCollisionEnter={handleCollision}

        >
            <group ref={group}>
                {/* Other components or meshes related to the enemy can be added here */}
                {model && <primitive object={model} />}
                 
            </group>
        </RigidBody>
    );
};

export default EnemyFBX;



useFBX.preload('/assets/ninja/ninja.fbx');