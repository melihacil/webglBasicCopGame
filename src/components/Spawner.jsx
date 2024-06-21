import { useState } from "react";
import Coin from "./Spawnables/Coin.jsx";
import EnemyFBX from "./Spawnables/EnemyFBX.jsx";
import EnemyGLB from "./Spawnables/EnemyGLB.jsx";
export default function Spawner({ setScore }) {
    const coinsData = [
        { id: 1, position: [5, 10, 5] },
        { id: 2, position: [-5, 10, -5] }
    ];
    // Coin part
    const [coins, setCoins] = useState(coinsData);

    const handleCoinCollect = (coinId) => {
        setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId));
        console.log(`Coin ${coinId} collected!`);
        setScore(prev => prev + 1);
    };


    return (<>

        {coins.map((coin) => (
            <Coin key={coin.id} position={coin.position} onCollect={() => handleCoinCollect(coin.id)} />
        ))}

        <EnemyFBX modelPath={"/assets/ninja/ninja.fbx"} animationPath="/assets/ninja/ninjarun.fbx" startPosition={[3, 2, 3]} targetPosition={[-8, 2, -3]} onCollect={() => handleCoinCollect(12)} />
        <EnemyGLB modelPath={"/assets/knight/knight.glb"} startPosition={[0, 2, 0]} targetPosition={[0, 2, 1]} onCollect={() => handleCoinCollect(12)} />


        {/* <Enemy modelPath={"/assets/knight/knight.glb"} animationPath="/assets/ninja/ninjarun.fbx" startPosition={[3, 2, 3]} targetPosition={[-8, 2, -3]} onCollect={() => handleCoinCollect(12)} /> */}

    </>)
}