const { getNamedAccounts, ethers } = require("hardhat")
let deployer

async function main() {
    deployer = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(">>>Funding contract...")
    //const sendValue = ethers.utils.parseEther("0.1")
    const sendValue = "10000000000"
    const transactionResponse = await fundMe.fund({ value: sendValue })
    await transactionResponse.wait(1)
    console.log(">>>Funded!")
}
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
