import Coin from "./Coin";

export default function Spawner() {



    // Coin part
    const [coins, setCoins] = useState([{ id: 1, position: [5, 10, 5] }, { id: 2, position: [-5, 10, -5] }]); // Example coins
    const handleCoinCollect = (coinId) => {
        setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId));
        console.log(`Coin ${coinId} collected!`);
    };


    return (<>

        {coins.map((coin) => (
            <Coin key={coin.id} position={coin.position} onCollect={() => handleCoinCollect(coin.id)} />
        ))}
    </>)
}