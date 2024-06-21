import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export default function DraggablePhysicsObj({ modelLocation, initialPosition, startDragging, scale = 2.0, yAxisLocked }) {
    const scene = useGLTF(modelLocation).scene;
    useLayoutEffect(() => scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), []);

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

        if (carRef.current && carRef.current.body) {
            const intersects = raycaster.current.intersectObjects([carRef.current.body]);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                const currentPosition = carRef.current.translation();
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

            if (carRef.current && carRef.current.body) {
                const intersects = raycaster.current.intersectObjects([carRef.current.body]);

                if (intersects.length > 0) {
                    const intersectionPoint = intersects[0].point;
                    const [offsetX, offsetY, offsetZ] = offset;

                    let newPosition = {
                        x: intersectionPoint.x - offsetX,
                        z: intersectionPoint.z - offsetZ,
                    };

                    // Lock the y-axis movement if yAxisLocked is true
                    if (!yAxisLocked) {
                        newPosition.y = intersectionPoint.y - offsetY;
                    } else {
                        newPosition.y = carRef.current.translation().y; // Maintain current y position
                    }

                    carRef.current.setTranslation(newPosition);
                }
            }
        }
    }, [dragging, offset, yAxisLocked, camera]);

    const handlePointerUp = useCallback((event) => {
        event.stopPropagation();
        setDragging(false);
        startDragging(false);
    }, []);

    useEffect(() => {
        if (dragging) {
            startDragging(true);

            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        } else {
            startDragging(false);

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
    }, [scene]);

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
            scale={scale}
        >
            <primitive object={scene} />
        </RigidBody>
    );
}




