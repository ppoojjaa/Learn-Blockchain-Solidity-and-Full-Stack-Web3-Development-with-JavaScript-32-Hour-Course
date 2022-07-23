const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-harhat-config")

//only run if we are on a testnets
developmentChains.includes(network.name)
    ? describe.skip
    : describe("fundMe", async () => {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              //no fixtures because in staging we are assuming that it is deployed.
              // no mock as we are on a testnet
              deployer = await getNamedAccounts().deployer
              fundMe = await ethers.getContract("fundMe", deployer)
          })

          it("Allows people to fund and withdraw", async () => {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBal = await fundMe.provider.getBalance(fundMe.address)
              assert.equal(endingBal.toString(), "0")
          })
      })
