import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { SoulboundEngine, OpenFactory, DemeritFactory, DealFactory } from "../typechain-types"

describe("SoulboundEngine", () => {
    let deployer: SignerWithAddress
    let user1: SignerWithAddress

    let soulboundEngine: SoulboundEngine

    beforeEach(async () => {
        const [_deployer, _user1] = await ethers.getSigners()
        deployer = _deployer
        user1 = _user1

        const soulboundEngineFactory = await ethers.getContractFactory("SoulboundEngine")
        soulboundEngine = (await soulboundEngineFactory
            .connect(_deployer)
            .deploy()) as SoulboundEngine
    })

    describe("registerFactory", () => {
        describe("when registering OpenFactory", () => {
            it("should register & be fetcheable", async () => {
                const defaultId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("default"))
                const contractFactory = await ethers.getContractFactory("OpenFactory")
                const openFactory = (await contractFactory.deploy()) as OpenFactory

                await soulboundEngine.registerFactory(defaultId, openFactory.address)
                const address = await soulboundEngine.getFactory(defaultId)

                expect(address).to.equal(openFactory.address)
            })
        })

        describe("when registrying DemeritFactory", () => {
            it("should register & be fetcheable", async () => {
                const defaultId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("demerit"))
                const contractFactory = await ethers.getContractFactory("DemeritFactory")
                const demeritFactory = (await contractFactory.deploy()) as DemeritFactory

                await soulboundEngine.registerFactory(defaultId, demeritFactory.address)
                const address = await soulboundEngine.getFactory(defaultId)

                expect(address).to.equal(demeritFactory.address)
            })
        })

        describe("when registrying DealFactory", () => {
            it("should register & be fetcheable", async () => {
                const defaultId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("deal"))
                const contractFactory = await ethers.getContractFactory("DealFactory")
                const dealFactory = (await contractFactory.deploy()) as DealFactory

                await soulboundEngine.registerFactory(defaultId, dealFactory.address)
                const address = await soulboundEngine.getFactory(defaultId)

                expect(address).to.equal(dealFactory.address)
            })
        })
    })
})
