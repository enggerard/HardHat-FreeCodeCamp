const { ethers, run, network } = require("hardhat")
require("dotenv").config()

async function main() {
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log(">>Deploying Contract ...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    //await simpleStorage.deployed() //OBSOLETE!?
    await simpleStorage.getDeployedCode()
    //await simpleStorage.waitForDeployment() //slower than getDeployedCode
    //what's the private key? --Not needed thanks to HARDHAT
    //what's the rpc address? --Not needed either
    //console.log(`Deployed contract at: ${simpleStorage.address}`) //OBSOLETE!?
    console.log(`>>Deployed contract at: ${simpleStorage.target}`)

    //what happens when we deploy to our hardhat network?
    //console.log(network.config)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for (6) blocks transactions ...")
        await simpleStorage.deploymentTransaction().wait(6) //wait for ETHERSCAN to mine some other blocks
        await verify(simpleStorage.target, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`>>Current value is: ${currentValue}`)

    //update current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`>>Updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying Contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
