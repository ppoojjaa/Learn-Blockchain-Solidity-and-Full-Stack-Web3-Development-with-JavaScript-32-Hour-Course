//in nodejs - {require()}

//in front-end js you cant use require  hence use import
import {ethers} from "./ethers-5.6.esm.min.js"
import {abi,contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const getBalanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fund")
connectButton.onclick = connect
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
fundButton.onclick = fund

async function connect() {
    
    if (typeof window.ethereum !== "underfined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        document.getElementById("connectButton").innerHTML = "Connected! :)"
    } else {
        document.getElementById("connectButton").innerHTML =
            "Please install metamask "
    }
}

async function getBalance(){
    if(typeof window.ethereum !="undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }

}

//fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with  ${ethAmount}`)
    if (typeof window.ethereum !== "underfined") {
        //provider - connection to the blockchain 
        //signer - wallet {someone with gas}
        //contract ABI and address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        //sees which account of the provider it is connected to 
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress,abi,signer)
        console.log(contract)
        try{
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
            })
            //listen for a tx to be mined 
            await listenFotTxMine(transactionResponse,provider)
            console.log("Done!")
        }
        catch(error){
            console.log(error)
        }
    } 
}

function listenFotTxMine(transactionResponse,provider){
    console.log(`Mining ${transactionResponse.hash} ...`)
    return new Promise((resolve, reject) =>{
        //create a listener for the blockchain
        //listen for this transaction to finish 
        
        provider.once(transactionResponse.hash, (transactionReceipt) =>{
            console.log(
                `Completed with ${transactionResponse.confirmations} confirmations`)
                //once the transaction hash is found, then call the function. 
                //this function only works once resolve or reject is called 
                //only finish this functiion when transactionResponse is found

            resolve()
        })

    })  
}

//withdraw
async function withdraw() {
    console.log("Withdrawing ....")
    if(typeof window.ethereum != "underfined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer)
        try{
            const transactionResponse = await contract.withdraw()
            await listenFotTxMine(transactionResponse,provider)
        }catch (error){
            console.log(error)
        }
        
    }
}