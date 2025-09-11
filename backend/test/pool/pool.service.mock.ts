import { PoolService } from "../../src/pool/pool.service";

export const poolMock = {
  id: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8", 
  token0: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 
  token1: "0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2", 
  symbol0: "USDC",
  symbol1: "ETH",
  symbol: "USDC/ETH",
  fee: 3000, 
  exchange: 1,
  network: 1,
  price0: 0.000345, 
  price0Change: 0.12, 
  price0_15: 0.000344,
  price0_15Change: 0.03,
  price0_60: 0.000342,
  price0_60Change: 0.09,
  price1: 2897.10, 
  price1Change: -0.12, 
  price1_15: 2905.00,
  price1_15Change: -0.03,
  price1_60: 2923.00,
  price1_60Change: -0.09,
  lastUpdate: new Date("2025-08-11T23:00:00Z"),
  lastUpdate_15: new Date("2025-08-11T22:45:00Z"),
  lastUpdate_60: new Date("2025-08-11T22:00:00Z"),
};


export const poolServiceMock = {
  provide: PoolService,
  useValue:{
    getPool: jest.fn().mockResolvedValue(poolMock),
    searchPool:jest.fn().mockResolvedValue(poolMock),
    getPools:jest.fn().mockResolvedValue([poolMock]),
    getPoolSymbols:jest.fn().mockResolvedValue([poolMock.symbol]),
    getTopPools:jest.fn().mockResolvedValue([poolMock]),
  }
}