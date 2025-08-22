import axios from "axios";
import ConfigBase from "../configBase";
import { PoolData, TokenData } from "./uniswapTypes";

export async function getTokens(skip: number = 0): Promise<TokenData[]> {
  const query = `
        {
            tokens(first: 1000, skip: ${skip})
            {
                symbol,
                id,
                decimals,
                name
            }
        }
    `;

  const { data } = await axios.post(ConfigBase.UNISWAP_GRAPH_URL, { query });

  return data ? (data.data.tokens as TokenData[]) : [];
}

export async function getTopPools(
  count: number = 20,
  skip: number = 0
): Promise<PoolData[]> {
  const query = `
        {
            pools(first: ${count}, skip: ${skip}, orderBy: volumeUSD, orderDirection: desc)
            {
                id,
                volumeUSD,
                feeTier,
                token0Price,
                token1Price,
                token0 {
                    symbol,
                    id,
                    decimals
                },
                token1 {
                    symbol,
                    id,
                    decimals
                }
            }
        }
    `;

  const { data } = await axios.post(ConfigBase.UNISWAP_GRAPH_URL, { query });

  return data ? (data.data.pools as PoolData[]) : [];
}
