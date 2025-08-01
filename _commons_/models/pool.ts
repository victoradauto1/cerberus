import { ChainId } from "./chainId";
import { Exchange } from "./exchange";

export default class Pool {
  id: string;
  token0: string;
  token1: string;
  symbol0: string;
  symbol1: string;
  symbol: string;
  fee: number;
  exchange: Exchange;
  network: ChainId;
  price0: string;
  price0Change: number;
  price0_15: string | null;
  price0_15Change: number | null;
  price0_60: string | null;
  price0_60Change: number | null;

  lastUpdate: Date;
  lastUpdate_15: Date;
  lastUpdate_60: Date;


  price1: string;
  price1Change: number;
  price1_15: string | null;
  price1_15Change: number | null;
  price1_60: string | null;
  price1_60Change: number | null;

  constructor(pool: Pool) {
    this.id = pool.id;
    this.token0 = pool.token0;
    this.token1 = pool.token1;
    this.symbol0 = pool.symbol0;
    this.symbol1 = pool.symbol1;
    this.symbol = pool.symbol;
    this.fee = pool.fee;
    this.exchange = pool.exchange;
    this.network = pool.network;
    this.price0 = pool.price0 || "0";
    this.price0Change = pool.price0Change || 0;
    this.price0_15 = pool.price0_15 || "0";
    this.price0_15Change = pool.price0_15Change || 0;
    this.price0_60 = pool.price0_15 || "0";
    this.price0_60Change = pool.price0_15Change || 0;
    


    this.lastUpdate = pool.lastUpdate || new Date();
    this.lastUpdate_15 = pool.lastUpdate_15 || new Date();
    this.lastUpdate_60 = pool.lastUpdate_60 || new Date();
    this.price1 = pool.price1 || "0";
    this.price1Change = pool.price1Change || 0;
    this.price1_15 = pool.price0_15 || "0";
    this.price1_15Change = pool.price1_15Change || 0;
    this.price1_60 = pool.price1_15 || "0";
    this.price1_60Change = pool.price1_15Change || 0;
  }
}
