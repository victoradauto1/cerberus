import axios from "axios";
import ethers, { TransactionReceipt, TransactionResponse } from "ethers";
import ConfigBase from "../configBase";
import { User } from "../models/user";
import { PoolData, TokenData } from "./uniswapTypes";

import Automation from "../models/automation";
import Pool from "../models/pool";
const ABI_ERC20 = require("./ERC20.json");
const ABI_UNISWAP = require("./Uniswap.json")

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

export async function swap(
  user: User,
  automation: Automation,
  pool: Pool
): Promise<string> {
  if (!user.privateKey) return Promise.resolve("0");

  const provider = new ethers.JsonRpcProvider(ConfigBase.RPC_NODE);
  const signer = new ethers.Wallet(user.privateKey, provider);
  const routerContract = new ethers.Contract(
    ConfigBase.UNISWAP_ROUTER,
    ABI_UNISWAP,
    provider
  );
  const token0Contract = new ethers.Contract(pool.token0, ABI_ERC20, signer);
  const token1Contract = new ethers.Contract(pool.token1, ABI_ERC20, signer);

  const condition = automation.isOpened
    ? automation.closeCondition
    : automation.openCondition;
  if (!condition) return Promise.resolve("0");

  const [tokenIn, tokenOut] =
    condition.field.indexOf("price0") !== -1
      ? [token1Contract, token0Contract]
      : [token0Contract, token1Contract];

  const amountIn = ethers.parseEther(automation.nextAmount);

  const allowance = await getAllowace(tokenIn.target.toString(), user.address);
  if (allowance < amountIn) await approve(tokenIn, amountIn);

  const params = {
    tokenIn,
    tokenOut,
    fee: pool.fee,
    recipient: user.address,
    deadline: Date.now() / 1000 + 10,
    amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  console.log(params);

  const tx: TransactionResponse = await routerContract.exactInputSingle(params, {
    from: user.address,
    gasPrice: ethers.parseUnits("25", "gwei"),
    gasLimit: 250000
  });

  console.log("Swap Tx Id: "+ tx.hash);

  let amountOutWei: bigint = 0n;

  try {
     const receipt: TransactionReceipt | null = await tx.wait();
  if(!receipt) throw new Error(`Swap error. Tx id: ${tx.hash}`);
  amountOutWei = ethers.toBigInt(receipt.logs[0].data);
  if(!amountOutWei) throw new Error(`Swap error. Tx id: ${tx.hash}`);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Swap error. Tx id: ${tx.hash}`);
  }

  const amountOutEth = ethers.formatEther(amountOutWei);
  console.log(`Swap success. Tx id ${tx.hash}. amount Out: ${amountOutEth}`);

  return amountOutEth;

}
