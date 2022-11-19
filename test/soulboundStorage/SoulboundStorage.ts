import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract, Signer } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "../utils/Setup"
import { SoulboundERC721 } from "../../typechain-types"
import { didRevert } from "../utils/DidRevert"

describe("SoulboundStorage", () => {
    let context: Context
    let deployer: SignerWithAddress
    let user: SignerWithAddress
    let engine: SignerWithAddress
    let factory: SignerWithAddress
    let collection: SignerWithAddress

    let ENGINE_REGISTRAR: string
    let FACTORY_REGISTRAR: string
    let ERC721_REGISTRAR: string
    let SOULBOUND_COLLECTION: string

    beforeEach(async () => {
        const [_deployer, _user, _engine, _factory, _collection] = await ethers.getSigners()
        context = await Setup()
        deployer = _deployer
        user = _user
        engine = _engine
        factory = _factory
        collection = _collection

        ENGINE_REGISTRAR = await context.soulboundStorage.ENGINE_REGISTRAR()
        FACTORY_REGISTRAR = await context.soulboundStorage.FACTORY_REGISTRAR()
        ERC721_REGISTRAR = await context.soulboundStorage.ERC721_REGISTRAR()
        SOULBOUND_COLLECTION = await context.soulboundStorage.SOULBOUND_COLLECTION()
    })

    describe("construction", () => {
        describe("deployer should have ENGINE_REGISTRAR role", () => {
            it("upon deployment", async () => {
                expect(await context.soulboundStorage.hasRole(ENGINE_REGISTRAR, deployer.address))
            })
        })
    })

    describe("registerEngine", () => {
        describe("should register the engine", () => {
            it("when called by the ENGINE_REGISTRAR role", async () => {
                await context.soulboundStorage.registerEngine(engine.address)
                expect(await context.soulboundStorage.hasRole(ENGINE_REGISTRAR, engine.address))
            })
        })
        describe("should revert", () => {
            it("when called by a non-ENGINE_REGISTRAR role", async () => {
                expect(
                    await didRevert(
                        context.soulboundStorage.connect(user).registerEngine(user.address)
                    )
                ).to.equal(true)
            })
        })
    })

    describe("registerFactory", () => {
        describe("should register a factory", () => {
            it("when called by the FACTORY_REGISTRAR role", async () => {
                await context.soulboundStorage.registerEngine(engine.address)
                await context.soulboundStorage.connect(engine).registerFactory(factory.address)
                expect(await context.soulboundStorage.hasRole(FACTORY_REGISTRAR, factory.address))
            })
        })
        describe("should revert", () => {
            it("when called by a non-FACTORY_REGISTRAR role", async () => {
                expect(
                    await didRevert(
                        context.soulboundStorage.connect(user).registerFactory(user.address)
                    )
                ).to.equal(true)
            })
        })
    })

    describe("registerCollection", () => {
        describe("should register a collection", () => {
            it("when called by the ERC721_REGISTRAR role", async () => {
                await context.soulboundStorage.registerEngine(engine.address)
                await context.soulboundStorage.connect(engine).registerFactory(factory.address)
                await context.soulboundStorage
                    .connect(factory)
                    .registerCollection(deployer.address, collection.address)
                expect(
                    await context.soulboundStorage.hasRole(SOULBOUND_COLLECTION, collection.address)
                )
                const collections = await context.soulboundStorage.getDeployedCollections(
                    deployer.address
                )
                expect(collections.length).to.equal(1)
                expect(collections[0]).to.equal(collection.address)
            })
        })
        describe("should revert", () => {
            it("when called by a non-ERC721_REGISTRAR role", async () => {
                expect(
                    await didRevert(
                        context.soulboundStorage
                            .connect(user)
                            .registerCollection(user.address, collection.address)
                    )
                ).to.equal(true)
            })
        })
    })

    describe("addIssuedToken", () => {
        describe("should add a issuedToken to the issuer & received", () => {
            it("when called by the SOULBOUND_COLLECTION role", async () => {
                await context.soulboundStorage.registerEngine(engine.address)
                await context.soulboundStorage.connect(engine).registerFactory(factory.address)
                await context.soulboundStorage
                    .connect(factory)
                    .registerCollection(deployer.address, collection.address)
                await context.soulboundStorage
                    .connect(collection)
                    .addIssuedToken(deployer.address, user.address, collection.address)

                const issuedTokens = await context.soulboundStorage
                    .connect(collection)
                    .getMintsByIssuer(deployer.address)
                expect(issuedTokens.length).to.equal(1)
                expect(issuedTokens[0].receiver).to.equal(user.address)
                expect(issuedTokens[0].collection).to.equal(collection.address)

                const receiverMints = await context.soulboundStorage
                    .connect(collection)
                    .getMintsByReceiver(user.address)
                expect(receiverMints.length).to.equal(1)
                expect(receiverMints[0].collection).to.equal(collection.address)
                expect(receiverMints[0].tokenId).to.equal(0)
                expect(receiverMints[0].completed).to.equal(false)
            })
        })
        describe("should revert", () => {
            it("when called by a non-SOULBOUND_COLLECTION role", async () => {
                expect(
                    await didRevert(
                        context.soulboundStorage
                            .connect(user)
                            .addIssuedToken(deployer.address, user.address, collection.address)
                    )
                ).to.equal(true)
            })
        })
    })

    describe("confirmMint", () => {
        describe("should update the receiver mint data", () => {
            it("when called by the SOULBOUND_COLLECTION role", async () => {
                await context.soulboundStorage.registerEngine(engine.address)
                await context.soulboundStorage.connect(engine).registerFactory(factory.address)
                await context.soulboundStorage
                    .connect(factory)
                    .registerCollection(deployer.address, collection.address)
                await context.soulboundStorage
                    .connect(collection)
                    .addIssuedToken(deployer.address, user.address, collection.address)
                await context.soulboundStorage
                    .connect(collection)
                    .confirmMint(user.address, collection.address, 1337)

                const receiverMints = await context.soulboundStorage.getMintsByReceiver(
                    user.address
                )
                expect(receiverMints.length).to.equal(1)
                expect(receiverMints[0].collection).to.equal(collection.address)
                expect(receiverMints[0].tokenId).to.equal(1337)
                expect(receiverMints[0].completed).to.equal(true)
            })
        })
        describe("should revert", () => {
            it("when called by a non-SOULBOUND_COLLECTION role", async () => {
                expect(
                    await didRevert(
                        context.soulboundStorage
                            .connect(user)
                            .confirmMint(user.address, collection.address, 1337)
                    )
                ).to.equal(true)
            })
        })
    })
})
