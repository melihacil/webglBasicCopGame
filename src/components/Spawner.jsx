import { useState, useEffect } from "react";
import Coin from "./Spawnables/Coin.jsx";
import EnemyFBX from "./Spawnables/EnemyFBX.jsx";
import EnemyGLB from "./Spawnables/EnemyGLB.jsx";
import { useFBX } from '@react-three/drei';

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

    const enemyData = [
        {id: 0, startPosition: [-5, 2, 3], targetPosition: [-8, 2, 20], rotateY: false },
        {id: 1, startPosition: [-5, 2, -35], targetPosition: [25, 2, -35], rotateY: true },
        {id: 2, startPosition: [65, 2, -35], targetPosition: [65, 2, 5], rotateY: false },
        {id: 3, startPosition: [25, 2, 12], targetPosition: [22, 2, 22], rotateY: false },
    ]

    // Coin part
    const [coins, setCoins] = useState(coinsData);
    const [enemies, setEnemies] = useState(enemyData);


    const handleCoinCollect = (coinId) => {
        setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId));
        console.log(`Coin ${coinId} collected!`);
        setScore((prev) => prev + 1);
    };

    const handleEnemyCollect = (enemyId) => {
        setEnemies((prevEnemies) => prevEnemies.filter((enemy) => enemy.id !== enemyId));
        console.log(`Enemy ${enemyId} destroyed!`);
        setScore((prev) => prev + 5);
    };

    // Set coins on mount
    useEffect(() => {
        setCoins(coinsData);
        setEnemies(enemyData);
    }, [isPlaying]);

    return (
        <>
            {isPlaying && coins.map((coin) => (
                <Coin key={coin.id} position={coin.position} onCollect={() => handleCoinCollect(coin.id)} />
            ))}

            {isPlaying && enemies.map((enemy) => (
                <EnemyFBX 
                    key={enemy.id} 
                    modelPath={"/assets/ninja/ninja.fbx"}
                    animationPath={"/assets/ninja/ninjarun.fbx"}
                    startPosition={enemy.startPosition} 
                    targetPosition={enemy.targetPosition} 
                    rotateY = {enemy.rotateY}
                    onCollect={() => handleEnemyCollect(enemy.id)} />
            ))}
            
            {/* <EnemyFBX
                modelPath={"/assets/ninja/ninja.fbx"}
                animationPath={"/assets/ninja/ninjarun.fbx"}
                startPosition={[-5, 2, -35]}
                targetPosition={[25, 2, -35]}
                onCollect={() => handleCoinCollect(12)
                }
                rotateY
            />  */}


            {/* <EnemyGLB
                modelPath={"/assets/knight/knight.glb"}
                startPosition={[0, 2, 0]}
                targetPosition={[0, 2, 1]}
                onCollect={() => handleCoinCollect(12)}
            /> */}
        </>
    );
}

useFBX.preload('/assets/ninja/ninja.fbx');
useFBX.preload('/assets/ninja/ninjarun.fbx');