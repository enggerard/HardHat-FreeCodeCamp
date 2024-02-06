//function deployFunc(hre) {
//  console.log(">>>Default FundMe deploy function!")
//  hre.getNamedAccounts()
//  hre.deployments
//}
//module.exports.default = deployFunc
//OR EQUIV
//module.exports = async (hre) => {
//    const { getNamedAccounts, deployments } = hre
//}
//OR EQUIV

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //If chainId is X use address Y
    //const ethUsdPriceFeedAddr = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //If the contract doesn't exist, we deploy a minimal version
    //for our local testing <=> to deploy a mock

    //When going to a local host or to a hardhat network we want to use a mock
    //What happens when we want to change chains?

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        //    contract: "FundMe",
        from: deployer,
        args: args, //add price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`>>>FundMe deployed at ${fundMe.address}`)
    log("_________________________________________")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundme"]

/********************** */
/*
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//const { verify } = require("../utils/verify")
//require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    //if (
    //    !developmentChains.includes(network.name) &&
    //    process.env.ETHERSCAN_API_KEY
    //) {
    //    await verify(fundMe.address, [ethUsdPriceFeedAddress])
    //}
}

module.exports.tags = ["all", "fundme"]
*/
