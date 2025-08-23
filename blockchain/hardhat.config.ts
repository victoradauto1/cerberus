import dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    amoy: {
      url: process.env.RPC_URL,
      chainId: parseInt(`${process.env.CHAIN_ID}`) || 80002,
      accounts: { mnemonic: process.env.SECRET }, 
    },
    local:{
      chainId: 31337,
      url: "http://127.0.0.1:8545",
      accounts:{
        mnemonic:"test test test test test test test test test test test junk"
      }
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.API_KEY!,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },
};

export default config;
