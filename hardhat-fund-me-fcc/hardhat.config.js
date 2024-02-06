require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-verify")
require("@nomicfoundation/hardhat-ethers")
require("@nomicfoundation/hardhat-chai-matchers")
require("@nomiclabs/hardhat-solhint")
require("dotenv").config()
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    //solidity: "0.8.19",
    solidity: {
        compilers: [
            { version: "0.8.8" },
            { version: "0.8.0" },
            { version: "0.6.6" },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: { chainId: 31337 },

        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },

        localhost: {
            url: "http://127.0.0.1:8545/",
            accounts: [], //default from locally generated!
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        //    coinmarketcap: process.env.COINMARKET_API_KEY,
        token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    mocha: { timeout: 500000 },
}
