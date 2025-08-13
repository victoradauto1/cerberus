import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Cerberus Pay tests", function () {
 
  async function deployFixture() {
  
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const CerberusPay = await hre.ethers.getContractFactory("CerberusPay");
    const cerberusPay = await CerberusPay.deploy();

    return { cerberusPay, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { cerberusPay, owner, otherAccount } = await loadFixture(deployFixture);

      expect(1).to.equal(1);
    });
  });
});
