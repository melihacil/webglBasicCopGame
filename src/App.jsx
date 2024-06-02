import { KeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { Stats } from '@react-three/drei'
import { Perf } from "r3f-perf";


export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );


  // useEffect(() =>



  // }, [])

  return (<>

    <KeyboardControls map={map}>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
        <color attach="background" args={["#ececec"]} />
        <Suspense>
          <Physics debug>
            <Experience />
          </Physics>
        </Suspense>
        <axesHelper args={[15]} position={[0, 0, 0]} />
        <gridHelper args={[20]} />
        <Stats />
        <Perf position="bottom-left" />
      </Canvas>
    </KeyboardControls>

  </>

  );
}

export default App;
