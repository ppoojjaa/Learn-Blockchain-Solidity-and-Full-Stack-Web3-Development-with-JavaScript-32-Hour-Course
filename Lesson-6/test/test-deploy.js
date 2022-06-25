const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
const { getAccountPath } = require("ethers/lib/utils")

// describe("SimpleStorage", () => {})
describe("SimpleStorage", function() {
    let simpleStorageFactory, simpleStorage
    beforeEach(async function() {
        //tell us what to do before each 'it' function
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    //its - where we write the code for running our tests
    it("Should start with a fav number of 0", async function() {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = 0;

        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should update when we call store", async function() {
        const storeValue = "5"
        const storeValueCheck = await simpleStorage.store(storeValue)
        await storeValueCheck.wait(1)

        const currentValue = await simpleStorage.retrieve()

        assert.equal(currentValue.toString(), storeValue)
    })

})