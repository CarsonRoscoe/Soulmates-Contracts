import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "./utils/Setup"

describe("SoulboundEngine", () => {
    let context: Context

    beforeEach(async () => {
        context = await Setup()
    })

    describe("registerFactory", () => {
        describe("when registering OpenFactory", () => {
            it("should register & be fetcheable", async () => {
                const address = await context.soulboundEngine.getFactory(context.openFactoryId)
                expect(address).to.equal(context.openFactory.address)
            })
        })

        describe("when registrying DemeritFactory", () => {
            it("should register & be fetcheable", async () => {
                const address = await context.soulboundEngine.getFactory(context.demeritFactoryId)
                expect(address).to.equal(context.demeritFactory.address)
            })
        })

        describe("when registrying DealFactory", () => {
            it("should register & be fetcheable", async () => {
                const address = await context.soulboundEngine.getFactory(context.dealFactoryId)
                expect(address).to.equal(context.dealFactory.address)
            })
        })
    })
})
