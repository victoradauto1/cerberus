import axios from "axios";
import ethers, { TransactionResponse } from "ethers";
import ConfigBase from "../configBase";
import { User } from "../models/user";
import { PoolData, TokenData } from "./uniswapTypes";

import * as ABI_ERC20 from "./ERC20.json";
import Automation from "../models/automation";
import Pool from "../models/pool";

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

export async function preApprove(
  user: User,
  tokenToApprove: string,
  amountInEth: string
) {
  if (!user.privateKey) throw new Error("User doesn't have private key.");

  const provider = new ethers.JsonRpcProvider(ConfigBase.RPC_NODE);

  const signer = new ethers.Wallet(user.privateKey, provider);

  const tokencontract = new ethers.Contract(tokenToApprove, ABI_ERC20, signer);

  const tx: TransactionResponse = await tokencontract.approve(
    ConfigBase.UNISWAP_ROUTER,
    ethers.parseEther(amountInEth)
  );
  console.log(`Approve tx: ${tx.hash}`);

  await tx.wait();
}

export async function approve(
  tokencontract: ethers.Contract,
  amountInWei: string | bigint
) {
  const tx: TransactionResponse = await tokencontract.approve(
    ConfigBase.UNISWAP_ROUTER,
    amountInWei
  );
  console.log(`Approve tx: ${tx.hash}`);

  await tx.wait();
}

export async function getAllowace(
  tokenAddress: string,
  wallet: string
): Promise<bigint> {
  const provider = new ethers.JsonRpcProvider(ConfigBase.RPC_NODE);
  const tokenContract = new ethers.Contract(tokenAddress, ABI_ERC20, provider);
  return tokenContract.allowance(wallet, ConfigBase.UNISWAP_ROUTER);
}

export async function swap(user: User, automation: Automation, pool: Pool): Promise<string>{
  return Promise.resolve("0"); //amountOut
}
