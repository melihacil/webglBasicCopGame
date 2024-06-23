import { KeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import GameLoop from "./components/GameLoop";
import { Stats } from '@react-three/drei'
import { Perf } from "r3f-perf";
import LightControl from "./components/UI/DirectionalLightControls.jsx";
import GameUI from "./components/UI/GameUI.jsx";
import CountdownTimer from "./components/UI/Countdown.jsx";

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

  const [yAxisLocked, setYAxisLocked] = useState(true); // Lock movement along the y-axis for draggable objects
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sHelper, setSHelper] = useState(false);
  const [showAmbient, setAmbient] = useState(true);

  const lightRef = useRef();

  const changeAmbient = () => {
    setAmbient(prev => !prev);
  }

  return (<>

    <KeyboardControls map={map}>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
        <color attach="background" args={["#ececec"]} />
        <Suspense>
          <Physics debug>
            <GameLoop light={lightRef} ambient={showAmbient} setScore={setScore} sHelper={sHelper} yAxisLocked={yAxisLocked} isPlaying={isPlaying} />
          </Physics>
        </Suspense>
        {/* <axesHelper args={[15]} position={[0, 0, 0]} />
        <gridHelper args={[20]} /> */}
        <Stats />
        <Perf position="bottom-left" />
      </Canvas>
      <LightControl lightRef={lightRef} ambientRef={changeAmbient} shadowHelper={setSHelper} lockYAxis={setYAxisLocked} />
      <GameUI score={score} setIsPlaying={setIsPlaying} />
      <CountdownTimer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </KeyboardControls>

  </>

  );
}

export default App;
