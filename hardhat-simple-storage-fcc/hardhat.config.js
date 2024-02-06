require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
require("./tasks/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");

//const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
//const PRIVATE_KEY = process.env.PRIVATE_KEY;
//const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
//const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },

    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts: //default from locally generated!
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false, //true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKET_API_KEY,
    token: "MATIC",
  },
};
