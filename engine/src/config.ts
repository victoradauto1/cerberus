import ConfigBase from "commons/configBase"
import { ChainId } from "commons/models/chainId";
import { Exchange } from "commons/models/exchange";

export default class Config extends ConfigBase{

  
static MONITOR_INTERVAL: number = parseInt(`${process.env.INTERVAL}`);
static NETWORK: string = `${process.env.NETWORK}`;

static getNetwork(network: string): ChainId{
  switch(network){
    case "polygon": return ChainId.POLYGON_MAINNET;
    case "polygon_test": return ChainId.POLYGON_AMOY;
    case "eth": return ChainId.ETH_MAINNET;
    default: return ChainId.ETH_MAINNET;
  }
}
static NETWORK2: ChainId = Config.getNetwork(`${Config.NETWORK}`);
static EXCHANGE: string = `${process.env.EXCHANGE}`;

static getExchange(exchange: string): Exchange{
  switch(exchange){
    case "uniswap": return Exchange.Uniswap;
    case "pancake": return Exchange.PancakeSwap;
    default: return Exchange.Uniswap;
  }
}

static EXCHANGE2: Exchange = Config.getExchange(`${Config.EXCHANGE}`)
static UNISWAP_GRAPH_URL: string = `${process.env.UNISWAP_GRAPH_URL}`;
static POOL_COUNT: number = parseInt(`${process.env.POOL_COUNT}`);
static WS_PORT: number = parseInt(`${process.env.WS_PORT}`);
}
