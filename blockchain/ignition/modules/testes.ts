// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ABI_MATIC = require("./abi.wmatic.json");
const WMATIC_MAINNET = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

const CerberusPay = buildModule("CerberusPay", (m) => {
  const cerberusPay = m.contract("CerberusPay");

  return { cerberusPay };
});

export default CerberusPay;
