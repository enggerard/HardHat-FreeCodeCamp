const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
  async (taskArgs, hre) => {
    blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`>>Current Block number is: ${blockNumber}`);
  }
);

module.exports = {};
