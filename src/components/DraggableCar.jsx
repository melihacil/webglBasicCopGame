import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';
import Car from './Car'; // Adjust the import path based on your project structure

export default function DraggableCar({ startDragging }) {
    const [hover, setHover] = useState(false);
    const carRef = useRef();
    const { camera, gl } = useThree();

    const bind = useDrag(({ active, movement: [mx, my], memo }) => {
        if (active) {
            startDragging(true);
            gl.domElement.style.cursor = 'grabbing';

            // Calculate mouse position in normalized device coordinates (-1 to +1)
            const mouse = new THREE.Vector2((mx / window.innerWidth) * 2 - 1, -(my / window.innerHeight) * 2 + 1);

            // Update the raycaster
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(carRef.current.children);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                if (!memo) {
                    const currentPosition = carRef.current.position;
                    memo = [
                        intersectionPoint.x - currentPosition.x,
                        intersectionPoint.y - currentPosition.y,
                        intersectionPoint.z - currentPosition.z,
                    ];
                }
                const [offsetX, offsetY, offsetZ] = memo;
                carRef.current.position.set(
                    intersectionPoint.x - offsetX,
                    intersectionPoint.y - offsetY,
                    intersectionPoint.z - offsetZ
                );
            }
            return memo;
        } else {
            startDragging(false);
            gl.domElement.style.cursor = hover ? 'pointer' : 'auto';
        }
    }, { pointerEvents: true });

    useFrame(() => {
        gl.domElement.style.cursor = hover ? 'pointer' : 'auto';
    });

    return (
        <Car
            ref={carRef}
            modelLocation="/assets/car/policeCarV1.glb"
            modelPosition={[3, 5, 0]}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onPointerDown={(event) => {
                event.stopPropagation();
                bind().onPointerDown(event);
            }}
        />
    );
}
