import { useFBX, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Controls } from "../App";

export default function Player() {
    const playerModel = useFBX("/assets/police/player.fbx");
    const runAnimation = useFBX("/assets/police/playerrun.fbx");
    const idleAnimation = useFBX("/assets/police/playeridle.fbx");

    const mixer = useRef();
    const actions = useRef({});
    const activeAction = useRef();
    const previousAction = useRef();

    useEffect(() => {
        mixer.current = new THREE.AnimationMixer(playerModel);

        actions.current.idle = mixer.current.clipAction(idleAnimation.animations[0]);
        actions.current.run = mixer.current.clipAction(runAnimation.animations[0]);
        actions.current.jump = mixer.current.clipAction(playerModel.animations[0]);  // Assuming jump animation is in the main model file

        activeAction.current = actions.current.idle;
        activeAction.current.play();

        return () => mixer.current.stopAllAction();
    }, [playerModel, runAnimation, idleAnimation]);


    const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
    const leftPressed = useKeyboardControls((state) => state[Controls.left]);
    const rightPressed = useKeyboardControls((state) => state[Controls.right]);
    const backPressed = useKeyboardControls((state) => state[Controls.back]);
    const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const isOnFloor = useRef(true);
    const cube = useRef();
    const playerRef = useRef();

    const { camera } = useThree();
    const speed = useRef(5);
    const maxSpeed = 5;

    useFrame((state, delta) => {
        if (mixer.current) mixer.current.update(delta);

        // const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
        // const leftPressed = useKeyboardControls((state) => state[Controls.left]);
        // const rightPressed = useKeyboardControls((state) => state[Controls.right]);
        // const backPressed = useKeyboardControls((state) => state[Controls.back]);
        // const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

        const isMoving = leftPressed || rightPressed || backPressed || forwardPressed;

        if (jumpPressed) {
            jump();
            setAction(actions.current.jump);
        } else if (isMoving) {
            setAction(actions.current.run);
        } else {
            setAction(actions.current.idle);
        }

        handleMovement();
    });

    const setAction = (toAction) => {
        if (toAction !== activeAction.current) {
            previousAction.current = activeAction.current;
            activeAction.current = toAction;

            previousAction.current.fadeOut(0.5);
            activeAction.current.reset().fadeIn(0.5).play();
        }
    };



    const jump = () => {
        cube.current.wakeUp();
        cube.current.applyImpulse({ x: 0, y: 60, z: 0 });
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

        // const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
        // const leftPressed = useKeyboardControls((state) => state[Controls.left]);
        // const rightPressed = useKeyboardControls((state) => state[Controls.right]);
        // const backPressed = useKeyboardControls((state) => state[Controls.back]);
        // const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

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
            velocity.normalize().multiplyScalar(speed.current * 5);
            cube.current.applyImpulse(velocity.multiplyScalar(2));

            const angle = Math.atan2(velocity.x, velocity.z);
            const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            playerRef.current.quaternion.slerp(quaternion, 0.1);
        }
    };

    return (
        <>
            <RigidBody ref={cube} type="dynamic" setCanSleep={false} lockRotations={true} name="player" rotation={[0, 0, 0]} >
                <primitive ref={playerRef} object={playerModel} name="player" scale={0.04} position={[8, 20, 8]} />
            </RigidBody>
        </>
    );
}
