import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Controls } from "../App";

export default function Player() {
    const playerModel = useGLTF("/assets/police/scene.gltf");
    useLayoutEffect(() => playerModel.scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), []);

    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const isOnFloor = useRef(true);
    const cube = useRef();
    const playerRef = useRef();

    const { camera } = useThree();

    const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
    const leftPressed = useKeyboardControls((state) => state[Controls.left]);
    const rightPressed = useKeyboardControls((state) => state[Controls.right]);
    const backPressed = useKeyboardControls((state) => state[Controls.back]);
    const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

    const speed = useRef(5);
    const maxSpeed = 10;

    const jump = () => {
        cube.current.wakeUp();
        cube.current.applyImpulse({ x: 0, y: 150, z: 0 });
        isOnFloor.current = false;
    };

    const handleMovement = () => {
        camera.getWorldDirection(direction);
        right.setFromMatrixColumn(camera.matrix, 0);
        right.crossVectors(camera.up, direction);
        forward.copy(direction);

        forward.y = 0;
        forward.normalize();
        right.y = 0;
        right.normalize();

        velocity.set(0, 0, 0);

        if (rightPressed) {
            cube.current.wakeUp();
            velocity.add(right.negate());
        }
        if (leftPressed) {
            cube.current.wakeUp();
            velocity.add(right);
        }

        if (forwardPressed) {
            cube.current.wakeUp();
            velocity.add(forward);
        }
        if (backPressed) {
            cube.current.wakeUp();
            velocity.add(forward.negate());
        }

        if (velocity.length() > 0) {
            velocity.normalize().multiplyScalar(speed.current);
            cube.current.applyImpulse(velocity.multiplyScalar(2));

            // Calculate the rotation angle
            const angle = Math.atan2(velocity.x, velocity.z);

            // Create a quaternion to represent the rotation
            const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

            // Set the rotation of the player model
            playerRef.current.quaternion.slerp(quaternion, 0.1);
        }
    };

    useFrame((_state, delta) => {
        if (jumpPressed) {
            jump();
        }
        handleMovement();

        // Get the linear velocity of the cube
        const linvel = cube.current.linvel();
        const linvelLength = Math.sqrt(linvel.x * linvel.x + linvel.y * linvel.y + linvel.z * linvel.z);

        // Apply a speed limit
        if (linvelLength > maxSpeed) {
            const normalizedLinvel = {
                x: linvel.x / linvelLength,
                y: linvel.y / linvelLength,
                z: linvel.z / linvelLength
            };
            cube.current.setLinvel({
                x: normalizedLinvel.x * maxSpeed,
                y: normalizedLinvel.y * maxSpeed,
                z: normalizedLinvel.z * maxSpeed
            });
        }

        if (isOnFloor.current) {
            console.log("Hey, I'm executing every frame!");
        }
    });

    return (
        <>
            <RigidBody ref={cube} type="dynamic" setCanSleep={false} lockRotations={true} name="player">
                <primitive ref={playerRef} object={playerModel.scene} name="player" scale={5.0} position={[8, 6, 8]} />
            </RigidBody>
        </>
    );
}
