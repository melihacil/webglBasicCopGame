import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

export default function DraggableObject({ modelLocation, initialPosition, startDragging, scale }) {
    const { scene } = useGLTF(modelLocation);
    const carRef = useRef();
    const [hover, setHover] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState([0, 0, 0]);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const { camera, gl } = useThree();

    const handlePointerDown = (event) => {
        event.stopPropagation();
        setDragging(true);

        // Calculate mouse position in normalized device coordinates (-1 to +1)
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster
        raycaster.current.setFromCamera(mouse.current, camera);
        const intersects = raycaster.current.intersectObjects([carRef.current], true);

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            const currentPosition = carRef.current.position;
            setOffset([
                intersectionPoint.x - currentPosition.x,
                intersectionPoint.y - currentPosition.y,
                intersectionPoint.z - currentPosition.z,
            ]);
        }
    };

    const handlePointerMove = useCallback((event) => {
        if (dragging) {
            event.stopPropagation();

            // Calculate mouse position in normalized device coordinates (-1 to +1)
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update the raycaster
            raycaster.current.setFromCamera(mouse.current, camera);
            const intersects = raycaster.current.intersectObjects([carRef.current], true);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                const [offsetX, offsetY, offsetZ] = offset;
                carRef.current.position.set(
                    intersectionPoint.x - offsetX,
                    intersectionPoint.y - offsetY,
                    intersectionPoint.z - offsetZ
                );
            }
        }
    }, [dragging, offset, camera]);

    const handlePointerUp = useCallback((event) => {
        event.stopPropagation();
        setDragging(false);
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

    useFrame(() => {
        if (dragging) {
            startDragging(true);
            gl.domElement.style.cursor = 'grabbing';
        } else {
            startDragging(false);
            gl.domElement.style.cursor = hover ? 'pointer' : 'auto';
        }
    });

    useEffect(() => {
        if (carRef.current) {
            carRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }, [scene]);

    return (
        <primitive
            object={scene}
            ref={carRef}
            scale={scale || 4.0}
            position={initialPosition}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => { setHover(false); setDragging(false); }}
            onPointerDown={handlePointerDown}
        />
    );
}
