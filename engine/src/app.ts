import Config from "./config";
import { getTopPools } from "./services/uniswapService";
import poolsRepository from "./repositories/poolsRepository";

async function executionCycle(){
    const pages = Math.ceil(Config.POOL_COUNT / 1000);

    for (let i = 0; i < pages; i++){
        const pools = await getTopPools(100, i * 1000);
        console.log(`Loaded ${pools.length} pools...`);


        for(let j = 0; j < pools.length; j++){
            const pool = pools[j];
            const result = await poolsRepository.updatePrices(pool);
            if(!result) continue;
            console.log(`Price for ${result.symbol} (${result.fee/ 10000}%) is ${Number(result.price0).toFixed(3)}`)
        }

    }
}

setInterval(executionCycle, Config.INTERVAL);


executionCycle();

console.log(`Cerberus Monitor started.`)
