const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
  let simpleStorageFactory, simpleStorage;

  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with a favorite number of zero", async function () {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = 0;
    assert.equal(currentValue, expectedValue);
  });

  it("Should update when store() is called", async function () {
    const currentValue = await simpleStorage.retrieve();
    //const expectedValue = currentValue + 1;
    const expectedValue = 7;
    const transactionResponse = await simpleStorage.store(expectedValue);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    //assert.greaterThan(updatedValue, currentValue);
    assert.equal(expectedValue, updatedValue);
  });
});
