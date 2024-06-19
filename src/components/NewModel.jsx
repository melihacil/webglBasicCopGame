import { useGLTF } from "@react-three/drei";

const LoadNewModel = (modelLocation) => {
    const model = useGLTF(modelLocation);
    // const model = useGLTF(modelLocation).scene.clone();

    if (modelLocation) {
        console.log(modelLocation);
    }
    return (
        <>
            <primitive object={model.scene} scale={0.01} position-y={2} />
        </>
    );
}

export default LoadNewModel;