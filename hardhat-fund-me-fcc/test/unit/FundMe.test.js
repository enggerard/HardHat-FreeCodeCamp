const { deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")

//test FundMe contract
describe("FundMe", async function () {
    //deploy FundMe contract using hardhat-deploy
    let fundMe
    let mockV3Aggregator
    let deployer
    //const sendValue = ethers.utils.parseEthers("1") //1e18 = 1ETH
    const sendValue = "1000000000000000000"
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer,
        )
    })

    //test constructor from FundMe contract
    describe("constructor", async function () {
        it("Sets the aggregator addresses correctly", async function () {
            const response = await fundMe.address
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    //test fund() function
    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            //    await expect(fundMe.fund()).to.be.revertedWith(
            //        "You need to spend more ETH",
            //    )
            await expect(fundMe.fund()).to.be.reverted
        })

        it("Updated the amount funded", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response, sendValue)
        })

        it("Add funder to list of funders", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.getFunder(0)
            assert.equal(funder, deployer)
        })
    })

    /* describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        it("Withdraw ETH from a single funder", async function () {
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address,
            )
            const startingDeployerBalance =
                await fundMe.provider.getBalance(deployer)
            //
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            //
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address,
            )
            const endingDeployerBalance =
                await fundMe.provider.getBalance(deployer)
            //
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost),
            )
        })
    })  */
})
