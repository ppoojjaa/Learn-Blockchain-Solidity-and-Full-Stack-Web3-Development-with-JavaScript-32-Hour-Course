const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        }) //we are doing this because if the verification step fails the entire script fails, we want the code to run despite the verification process failing
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
