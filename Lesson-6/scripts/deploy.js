const { ethers, run, network } = require("hardhat")


//main
async function main() {
    const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying contract ...")
    const simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(simpleStorage.address)
        //if we are on the testnet, it will verify the contract
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Witing for block conformations ...")
        await simpleStorage.deployTransaction.wait(6) //wait 6 blocks then verify the contract. This is done because etherscan can take a bit longer to update even though the transaction has been added on the blockchain  
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is : ${currentValue}`)

    //update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value: ${updatedValue}`)

}

//to avoid the verify & public feature and do that automatically ; install plugin by {yarn add --dev @nomiclabs / hardhat - etherscan}
async function verify(contractAddress, args) {
    //const verify = async (contractAddress, args) =>{
    console.log("Verifying contract ...")
    try {
        await run("verify:verify", {
                address: contractAddress,
                constructorAguments: args,
            }) //we are doing this because if the verification step fails the entire script fails, we want the code to run despite the verification process failing 
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