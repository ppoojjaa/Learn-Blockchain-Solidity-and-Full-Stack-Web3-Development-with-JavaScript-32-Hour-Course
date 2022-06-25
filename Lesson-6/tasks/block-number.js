//current block number of the network
const { task } = require("hardhat/config")


task("block-number", "Print the current block number").setAction(
    async(taskArgs, hre) => {
        const blockNum = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number: ${blockNum}`)

    }
)

module.exports = {}

// tasks are better for plugins and scripts are better forlocal development enviornment