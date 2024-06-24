import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { useFBX } from '@react-three/drei';

import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const EnemyFBX = ({
  modelPath,
  animationPath,
  startPosition = [0, 0, 0],
  targetPosition = [10, 0, 10],
  speed = 0.1,
  onCollect,
  rotateY = false
}) => {
  const group = useRef();
  const rbgroup = useRef();

  const mainModel = useFBX(modelPath);
  const model = SkeletonUtils.clone(mainModel);
  useLayoutEffect(() => {
    model.traverse((o) => (o.isMesh && (o.castShadow = o.receiveShadow = true)));
  }, []);

  const animation = useLoader(FBXLoader, animationPath);
  const mixer = useRef();
  let velocity;
  const [movingToTarget, setMovingToTarget] = useState(true);

  // Adding animations to the models
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

    // Apply translation directly to RigidBody
    rbgroup.current.setTranslation({ x: newPosition.x, y: newPosition.y, z: newPosition.z }, true);

    // **Update rotation to face the direction of movement:**
    const angle = Math.atan2(-direction.x, direction.z); // Calculate angle based on movement direction
    const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

    // **Apply rotation only to the model:**
    if (group.current.children.length > 0) {
      const modelObject = group.current.children[0];
      modelObject.setRotationFromQuaternion(quaternion);
    }

    // Check if the enemy has reached the target position
    if (currentPos.distanceTo(targetPos) < 0.1) {
      setMovingToTarget(!movingToTarget); // Toggle direction
    }
  });

  const handleCollision = ({ other }) => {
    const colliderName = other.rigidBodyObject?.name; // Optional chaining
    if (colliderName === 'player') {
      onCollect();
    }
  };

  return (
    <RigidBody
      type="dynamic"
      position={startPosition}
      lockRotations={true} // Prevents RigidBody from rotating (important for physics)
      scale={0.04}
      ref={rbgroup}
      onCollisionEnter={handleCollision}
      rotation={[0, rotateY && Math.PI , 0]}
    >
      <group ref={group}>
        {/* Other components or meshes related to the enemy can be added here */}
        {model && <primitive object={model} />}
      </group>
    </RigidBody>
  );
};

export default EnemyFBX;


