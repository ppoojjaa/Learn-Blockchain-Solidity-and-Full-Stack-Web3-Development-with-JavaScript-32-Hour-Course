const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-harhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    //if chainid != 0dhuidh then deploy to mock
    if (developmentChains.includes(network.name)) {
        log("Local Network detected. Deploying mock...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true, //deploying "MockV3Aggreagtor" tx: ... deployed at ... with ...gas
            args: [DECIMALS, INITIAL_ANSWER], //constructor parameters for the MockV3Aggregator ;
            //this takes a decimal and a initial answer as parameters
        })
        log("Mocks deployed!")
        log("--------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"] //yarn hardhat deploy --tags
//this will onli run the deploy scripts that have a special tag
