import { ethers, Provider, JsonRpcProvider, Contract, Signer, TransactionResponse } from "ethers";
import { abi as ABI } from "./CerberusPay.json";
import ConfigBase from "../configBase";

function getProvider(): Provider {
  return new JsonRpcProvider("https://rpc-amoy.polygon.technology/");
}

function getContract(): Contract {
  const provider = getProvider();
  return new ethers.Contract(ConfigBase.CERBERUS_PAY_CONTRACT, ABI, provider);
}

function getSigner(): Contract {
  const provider = getProvider();
  const signer = new ethers.Wallet(ConfigBase.ADMIN_PRIVATE_KEY, provider);
  return new ethers.Contract(ConfigBase.CERBERUS_PAY_CONTRACT, ABI, signer);
}

export function getCustomers(): Promise<string[]> {
  return getContract().getCustomers();
}

export function getCustomerNextPayment(customer: string): Promise<number> {
  return getContract().payments(customer);
}

export async function pay(customer: string): Promise<string> {
  const tx: TransactionResponse= await getSigner().pay(customer);
  await tx.wait();
  return tx.hash;
}
