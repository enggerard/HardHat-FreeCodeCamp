const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const deployer = await getNamedAccounts()
    //let deployer
    //deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(">>>Withdrawing funds...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log(">>>Withdrawned!")
}
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
