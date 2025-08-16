import {
  time,
  loadFixture,
  setBalance,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import CerberusPay from "../ignition/modules/CerberusPay";

describe("CerberusPay tests", function () {

 
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

    it("Should do second payment", async function () {
      const { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount } = await loadFixture(deployFixture);

      const instance  = cerberusCoin.connect(otherAccount);
      await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

      await cerberusPay.pay(otherAccount.address);

      await time.increase(31 * 24 * 60 * 60);

      await expect(cerberusPay.pay(otherAccount.address)).to.emit(cerberusPay, "Paid");
    });

    it("Should NOT do second payment", async function () {
      const { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount } = await loadFixture(deployFixture);

      const instance  = cerberusCoin.connect(otherAccount);
      await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

      await cerberusPay.pay(otherAccount.address);

      await time.increase(31 * 24 * 60 * 60);

       await instance.approve(cerberusAddress, ethers.parseEther("0.0001"));

      await expect(cerberusPay.pay(otherAccount.address)).revertedWith("Insufficient balance and/or allowance")
    });

    it("Should do second payment after a failure", async function () {
      const { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount } = await loadFixture(deployFixture);

      const instance  = cerberusCoin.connect(otherAccount);
      await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

      await cerberusPay.pay(otherAccount.address);

      await time.increase(31 * 24 * 60 * 60);

       await instance.approve(cerberusAddress, ethers.parseEther("0.0001"));

      await expect(cerberusPay.pay(otherAccount.address)).revertedWith("Insufficient balance and/or allowance");

      await instance.approve(cerberusAddress, ethers.parseEther("1"));

      await expect(cerberusPay.pay(otherAccount.address)).to.emit(cerberusPay, "Paid");
    });

    it("Should withdraw", async function () {
      const { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount } = await loadFixture(deployFixture);

      const value = await cerberusPay.monthlyAmount();
      const instance  = cerberusCoin.connect(otherAccount);
      await instance.approve(cerberusAddress, value);
      await cerberusPay.pay(otherAccount.address);
      expect(await instance.balanceOf(cerberusAddress)).to.be.equal(value);

      await cerberusPay.withdraw(value);
      expect(await instance.balanceOf(cerberusAddress)).to.be.equal(0);
    });
  });
});
