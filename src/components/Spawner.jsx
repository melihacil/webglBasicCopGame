import { useState } from "react";
import Coin from "./Spawnables/Coin.jsx";
import Enemy from "./Spawnables/Enemy.jsx";

export default function Spawner({ setScore }) {



    // Coin part
    const [coins, setCoins] = useState([{ id: 1, position: [5, 10, 5] }, { id: 2, position: [-5, 10, -5] }]); // Example coins
    const handleCoinCollect = (coinId) => {
        setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId));
        console.log(`Coin ${coinId} collected!`);
        setScore(prev => prev + 1);
    };


    return (<>

        {coins.map((coin) => (
            <Coin key={coin.id} position={coin.position} onCollect={() => handleCoinCollect(coin.id)} />
        ))}

        <Enemy modelPath={"/assets/ninja/ninja.fbx"} animationPath="/assets/ninja/ninjarun.fbx" startPosition={[1, 10, 1]} targetPosition={[12, 10, 12]} />
    </>)
}