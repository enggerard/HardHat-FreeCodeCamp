const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const { chainId } = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log(">>>Local deployment detected ... Deploying mocks!")
        await deploy("MockV3Aggregator", {
            contract:
                "@chainlink/contracts/src/v0.8/tests/MockV3Aggregator.sol:MockV3Aggregator", //"MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_PRICE],
            log: true,
        })
    }

    log(">>>Mocks deployed!")
    log("_____________________________________")
}

module.exports.tags = ["all", "mocks"]
/******************* */
/*
const { network } = require("hardhat")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract:
                "@chainlink/contracts/src/v0.8/tests/MockV3Aggregator.sol:MockV3Aggregator", //"MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
        log(
            "You are deploying to a local network, you'll need a local network running to interact",
        )
        log(
            "Please run `npx hardhat console` to interact with the deployed smart contracts!",
        )
        log("------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
*/
