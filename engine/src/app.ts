import Config from "./config";
import {Token} from "commons/models/token"
import { getTopPools } from "./services/uniswapService";



console.log("Hello world");
console.log(Config.INTERVAL);
console.log(Config.EXCHANGE2);

getTopPools()
    .then(data => console.log(data))
    .catch(err => console.error(err));
