//1.
// function deployFunc() {
//     console.log("Hey!")
//     hre.getNamedAccounts()
//     hre.deployments()
// }
// module.exports.default = deployFunc()

// const { networks } = require("../hardhat.config")

//2.
//pulls out the variables from the hardhat runtime enviornment
// module.exports = async (hre) => {
//     const {getNamedAccounts,deployments} = hre
//     //hre.getNamedAccounts
//     //hre.deployments
// }

//pulls out netrworkConfig from the file
const { networkConfig } = require("../helper-harhat-config")
const { network } = require("hardhat")
const { developmentChains } = require("../helper-harhat-config")
const { verify } = require("../utils/verify")
//3.
module.exports = async ({ getNamedAccounts, deployments }) => {
    //deployemts is used to get 2 functions - deploy and log
    const { deploy, log } = deployments
    //when working with ethers, we can get accounts based off of the number in the account section of each network
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if chainId id X use address Y ; to this we require Aave
    //Aave is another protocol that's on multiple chains and has to deploy their code and work with multiple chains
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        //get most recent development
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //what happens when we want to change chains?

    //when going for localhost or harhatnetwork we want to use mock
    //previously we used contractfactories for deploying the contract
    //with hardhat deploy we can use just the deploy function
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //priceFeed address from AggregatorV3Interface
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
        //wait 6 blocks for confirmation or  1
        // or 1 means if no block confirmation is given in our hardhat.config then wait 1 block
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, args)
    }
    log("---------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
