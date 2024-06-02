import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { Physics } from '@react-three/rapier';

export default function DraggableBox({ startDragging }) {
    const [hover, setHover] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState([0, 0, 0]);
    const boxRef = useRef();
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const { camera, gl, scene } = useThree();

    const handlePointerDown = (event) => {
        event.stopPropagation();
        setDragging(true);

        // Calculate mouse position in normalized device coordinates (-1 to +1)
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster
        raycaster.current.setFromCamera(mouse.current, camera);
        const intersects = raycaster.current.intersectObjects([boxRef.current]);

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            const currentPosition = boxRef.current.position;
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
            mouse.current.y = - (event.clientY / window.innerHeight) * 2 + 1;

            // Update the raycaster
            raycaster.current.setFromCamera(mouse.current, camera);
            const intersects = raycaster.current.intersectObjects([boxRef.current]);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                const [offsetX, offsetY, offsetZ] = offset;
                boxRef.current.position.set(
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

    return (
        <Box
            ref={boxRef}
            position={[3, 5, 0]}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => { setHover(false); setDragging(false); }}
            onPointerDown={handlePointerDown}
        >
            <meshStandardMaterial color={hover ? 'hotpink' : 'royalblue'} />
        </Box>
    );
}
