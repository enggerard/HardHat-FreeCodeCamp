import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connect_button = document.getElementById("connect_button")
connect_button.onclick = connect
const fund_button = document.getElementById("fund_button")
fund_button.onclick = fund
const balance_button = document.getElementById("balance_button")
balance_button.onclick = getBalance
const withdraw_button = document.getElementById("withdraw_button")
withdraw_button.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        //console.log("MetaMask is injected into the browser!")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        //console.log("Connected!")
        //document.getElementById("connect_button").innerHTML = "Connected!"
        connect_button.innerHTML = "Connected!"
    } else {
        //console.log("There is no MetaMask!")
        //document.getElementById("connect_button").innerHTML =
        //    "Install MetaMask!"
        connect_button.innerHTML = "Install MetaMask!"
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
        //balance_button.innerHTML = "Connected!"
    } /*else {
        balance_button.innerHTML = "Install MetaMask!"
    }*/
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing ...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

//async function fund(_ethAmount) {
async function fund() {
    //const ethAmount = "0.1"
    const ethAmount = document.getElementById("ethAmount_input").value
    /*console.log(`Funding with ${_ethAmount}`)*/
    console.log(`Funding with ${ethAmount} ...`)
    //To send a transaction we need:
    //- a provider or connection to the blockchain
    //- a signer or wallet or someone with some gas
    //- a contract to interact with <=> ABI x Address
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
        //Wait for this transaction to finish!
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done!")
    } catch (error) {
        console.log(error)
    }
}

function listenForTransactionMine(_transactionResponse, _provider) {
    console.log(`Mining ${_transactionResponse.hash} ...`)
    //return new Promise()
    return new Promise((resolve, reject) => {
        //create a listener for the blockchain
        _provider.once(_transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Terminated with ${transactionReceipt.confirmations} confirmations!`,
            )
            resolve()
        })
    })
}
