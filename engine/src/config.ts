import { ChainId } from "commons/models/chainId";
import { Exchange } from "commons/models/exchange";
import dotenv from "dotenv";
dotenv.config();

const INTERVAL: number = parseInt(`${process.env.INTERVAL}`);
const NETWORK: string = `${process.env.NETWORK}`;

function getNetwork(network: string): ChainId{
  switch(network){
    case "polygon": return ChainId.POLYGON_MAINNET;
    case "polygon_test": return ChainId.POLYGON_AMOY;
    case "eth": return ChainId.ETH_MAINNET;
    default: return ChainId.ETH_MAINNET;
  }
}
const NETWORK2: ChainId = getNetwork(`${process.env.NETWORK}`);
const EXCHANGE: string = `${process.env.EXCHANGE}`;

function getExchange(exchange: string): Exchange{
  switch(exchange){
    case "uniswap": return Exchange.Uniswap;
    case "pancake": return Exchange.PancakeSwap;
    default: return Exchange.Uniswap;
  }
}

const EXCHANGE2: Exchange = getExchange(`${process.env.EXCHANGE}`)
const DATABASE_URL: string =`${process.env.DATABASE_URL}`;
const UNISWAP_GRAPH_URL: string = `${process.env.UNISWAP_GRAPH_URL}`;
const POOL_COUNT: number = parseInt(`${process.env.POOL_COUNT}`);

export default {
  INTERVAL,
  NETWORK,
  NETWORK2,
  EXCHANGE,
  EXCHANGE2,
  DATABASE_URL,
  UNISWAP_GRAPH_URL,
  POOL_COUNT,
};
