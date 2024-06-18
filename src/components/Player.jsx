import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { Controls } from "../App";

export default function Player() {
    const playerModel = useGLTF("/assets/police/scene.gltf");

    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const isOnFloor = useRef(true);
    const cube = useRef();

    const { camera } = useThree();

    const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
    const leftPressed = useKeyboardControls((state) => state[Controls.left]);
    const rightPressed = useKeyboardControls((state) => state[Controls.right]);
    const backPressed = useKeyboardControls((state) => state[Controls.back]);
    const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

    const speed = useRef(5);
    const maxSpeed = 10;

    const jump = () => {
        if (isOnFloor.current) {
            cube.current.applyImpulse({ x: 0, y: 5, z: 0 });
            isOnFloor.current = false;
        }
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
            velocity.add(right.negate());
        }
        if (leftPressed) {
            velocity.add(right);
        }

        if (forwardPressed) {
            velocity.add(forward);
        }
        if (backPressed) {
            velocity.add(forward.negate());
        }

        if (velocity.length() > 0) {
            velocity.normalize().multiplyScalar(speed.current);
            cube.current.applyImpulse(velocity.multiplyScalar(0.1));
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
            <RigidBody ref={cube}>
                <primitive object={playerModel.scene} scale={1.0} position={[4, 4, 4]} />
            </RigidBody>
        </>
    );
}
