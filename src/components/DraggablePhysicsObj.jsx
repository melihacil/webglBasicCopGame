import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';


export default function DraggablePhysicsObj({ modelLocation, initialPosition, startDragging }) {
    // const gltf = useLoader(GLTFLoader, modelLocation);
    // const scene = gltf.scene.clone();
    const scene = useGLTF(modelLocation).scene;
    useLayoutEffect(() => scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), [])

    const carRef = useRef();
    const objRef = useRef();

    const [hover, setHover] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState([0, 0, 0]);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const { camera, gl } = useThree();

    const handlePointerDown = (event) => {
        event.stopPropagation();
        setDragging(true);

        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.current.setFromCamera(mouse.current, camera);


        // Check if carRef.current is defined before accessing .body
        if (carRef.current && carRef.current.body) {
            const intersects = raycaster.current.intersectObjects([carRef.current.body]);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                const currentPosition = carRef.current.translation();
                console.log(currentPosition)
                setOffset(new THREE.Vector3().copy(intersectionPoint).sub(currentPosition));
            }
        }

    };

    const handlePointerMove = useCallback((event) => {
        if (dragging) {
            startDragging(true);
            event.stopPropagation();

            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.current.setFromCamera(mouse.current, camera);
            // Check if carRef.current is defined before accessing .body
            if (carRef.current && carRef.current.body) {
                raycaster.current.setFromCamera(mouse.current, camera);
                const intersects = raycaster.current.intersectObjects([carRef.current.body]);

                if (intersects.length > 0) {
                    const intersectionPoint = intersects[0].point;
                    const [offsetX, offsetY, offsetZ] = offset;
                    carRef.current.setTranslation({
                        x: intersectionPoint.x - offsetX,
                        y: intersectionPoint.y - offsetY,
                        z: intersectionPoint.z - offsetZ,
                    });
                }
            }
        }
    }, [dragging, offset, camera]);

    const handlePointerUp = useCallback((event) => {
        event.stopPropagation();
        setDragging(false);
        startDragging(false);
    }, []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        } else {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        }

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [dragging, handlePointerMove, handlePointerUp]);


    useEffect(() => {
        if (carRef.current) {
            carRef.current.body = scene; // Assuming scene contains the physics body
        }
    }, []);
    useFrame(() => {
        if (dragging) {
            startDragging(true);
            gl.domElement.style.cursor = 'grabbing';
        } else {
            startDragging(false);
            gl.domElement.style.cursor = hover ? 'pointer' : 'auto';
        }
    });

    return (
        <RigidBody
            ref={carRef}
            position={initialPosition}
            colliders="hull"
            type="dynamic"
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => { setHover(false); setDragging(false); }}
            onPointerDown={handlePointerDown}
            scale={2.0}
        >
            <primitive object={scene} />
        </RigidBody >
    );
}