import { useState, useEffect } from "react";
import Coin from "./Spawnables/Coin.jsx";
import EnemyFBX from "./Spawnables/EnemyFBX.jsx";
import EnemyGLB from "./Spawnables/EnemyGLB.jsx";

export default function Spawner({ setScore, isPlaying }) {
    const coinsData = [
        { id: 0, position: [-5, 1.5, 35] },
        { id: 1, position: [15, 1.5, 15] },
        { id: 2, position: [-15, 1.5, -3] },
        { id: 3, position: [-15, 1.5, -15] },
        { id: 4, position: [-25, 1.5, 20] },
        { id: 5, position: [35, 1.5, 25] },
        { id: 6, position: [45, 1.5, -15] },
        { id: 7, position: [65, 1.5, -25] },

        { id: 8, position: [35, 1.5, -45] },
        { id: 9, position: [-10, 1.5, -45] },

        { id: 10, position: [10, 1.5, -35] },

        { id: 11, position: [24, 1.5, 45] },
        { id: 12, position: [50, 1.5, 15] },
        { id: 13, position: [1, 1.5, -5] },

    ];

    // Coin part
    const [coins, setCoins] = useState(coinsData);

    const handleCoinCollect = (coinId) => {
        setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId));
        console.log(`Coin ${coinId} collected!`);
        setScore((prev) => prev + 1);
    };

    // Set coins on mount
    useEffect(() => {
        setCoins(coinsData);
    }, [isPlaying]);

    return (
        <>
            {isPlaying && coins.map((coin) => (
                <Coin key={coin.id} position={coin.position} onCollect={() => handleCoinCollect(coin.id)} />
            ))}
            <EnemyFBX
                modelPath={"/assets/ninja/ninja.fbx"}
                animationPath={"/assets/ninja/ninjarun.fbx"}
                startPosition={[3, 2, 3]}
                targetPosition={[-8, 2, -3]}
                onCollect={() => handleCoinCollect(12)}
            />
            <EnemyGLB
                modelPath={"/assets/knight/knight.glb"}
                startPosition={[0, 2, 0]}
                targetPosition={[0, 2, 1]}
                onCollect={() => handleCoinCollect(12)}
            />
        </>
    );
}