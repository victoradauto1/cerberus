// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CerberusPay = buildModule("CerberusPay", (m) => {
  const cerberusPay = m.contract("CerberusPay");

  return { cerberusPay };
});

export default CerberusPay;
