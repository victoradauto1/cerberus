// scripts/deposit.ts
import { ethers } from "hardhat";
const ABI_MATIC = require("../abi.wmatic.json");
const WMATIC_MAINNET = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

async function main() {
  const [signer] = await ethers.getSigners(); // pega primeira conta do Hardhat Network
  const WALLET = await signer.getAddress();

  const wmaticContract = new ethers.Contract(WMATIC_MAINNET, ABI_MATIC, signer);

  const tx = await wmaticContract.deposit({
    value: ethers.parseEther("10"),
  });
  await tx.wait();

  console.log("Tx deposit: " + tx.hash);

  const balance = await wmaticContract.balanceOf(WALLET);
  console.log("balance WMATIC: " + ethers.formatEther(balance));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
