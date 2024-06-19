import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

const Enemy = ({ modelPath, animationPath, startPosition = [0, 0, 0], radius = 5, speed = 0.01 }) => {
    const group = useRef();
    const rbgroup = useRef();

    const model = useLoader(FBXLoader, modelPath);
    useLayoutEffect(() => model.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), []);

    const animation = useLoader(FBXLoader, animationPath);
    const mixer = useRef();

    const [angle, setAngle] = useState(0);

    useEffect(() => {
        if (model && animation) {
            mixer.current = new THREE.AnimationMixer(model);
            const action = mixer.current.clipAction(animation.animations[0]);
            action.play();
            group.current.add(model);
        }
    }, [model, animation]);

    useFrame((state, delta) => {
        if (mixer.current) mixer.current.update(delta);

        // Calculate the new position for the circular path
        const x = startPosition[0] + radius * Math.cos(angle);
        const z = startPosition[2] + radius * Math.sin(angle);

        // Update the position of the group (which indirectly updates the RigidBody position)
        group.current.position.set(x, startPosition[1], z);




        // const prevX = rbgroup.current.translation().x;
        // const prevZ = rbgroup.current.translation().z;

        // // const nx = startPosition[0] + radius * Math.cos(angle);
        // // const nz = startPosition[2] + radius * Math.sin(angle);

        // // Update the position of the RigidBody
        // rbgroup.current.setTranslation(startPosition[0], startPosition[1], startPosition[0]);
        // Calculate the direction vector
        const direction = new THREE.Vector3(x - startPosition[0], 0, z - startPosition[2]).normalize();

        // Create a quaternion to represent the rotation
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

        // Update the rotation of the group (which indirectly updates the RigidBody rotation)
        group.current.setRotationFromQuaternion(quaternion);

        // Update the angle for the next frame
        setAngle(prevAngle => prevAngle + speed);
    });

    return (
        <RigidBody type="kinematicPosition" position={startPosition} scale={0.04} ref={rbgroup}>
            <group ref={group}>
                {/* Other components or meshes related to the enemy can be added here */}
                {model && <primitive object={model} />}
            </group>
        </RigidBody>
    );
};

export default Enemy;
// useFrame((_state, delta) => {
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