import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("CerberusPay tests", function () {

  //criar um mock de usuário
 
  async function deployFixture() {
  
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const CerberusCoin = await hre.ethers.getContractFactory("CerberusCoin");
    const cerberusCoin = await CerberusCoin.deploy();
    await cerberusCoin.waitForDeployment();

    const CerberusPay = await hre.ethers.getContractFactory("CerberusPay");
    const cerberusPay = await CerberusPay.deploy();
    await cerberusPay.waitForDeployment();

    const cerberusAddress = cerberusPay.target;

    cerberusPay.setAcceptedToken(cerberusCoin.target);

    await cerberusCoin.mint(otherAccount.address, ethers.parseEther("1"));

    return { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should do first payment", async function () {
      const { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount } = await loadFixture(deployFixture);

      const instance  = cerberusCoin.connect(otherAccount);
      await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

      await expect(cerberusPay.pay(otherAccount.address)).to.emit(cerberusPay, "Paid");
    });

    it("Should NOT do first payment", async function () {
      const { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount } = await loadFixture(deployFixture);


      await expect(cerberusPay.pay(otherAccount.address)).revertedWith("Insufficient balance and/or allowance");
    });

  });
});
