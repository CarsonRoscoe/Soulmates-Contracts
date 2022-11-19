import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "../utils/Setup"
import { SoulboundERC721 } from "../../typechain-types"
import { didRevert } from "../utils/DidRevert"

describe("SoulboundERC721", () => {
    const NAME = "Name"
    const SYMBOL = "Symbol"
    const URI = "ipfs://hash"

    let context: Context
    let soulboundERC721: SoulboundERC721

    beforeEach(async () => {
        context = await Setup()

        await context.openFactory.connect(context.users.user1).createCollection(NAME, SYMBOL, URI)

        const collections = await context.soulboundStorage.getDeployedCollections(
            context.users.user1.address
        )

        soulboundERC721 = (await ethers.getContractAt(
            "SoulboundERC721",
            collections[0]
        )) as SoulboundERC721
    })

    describe("issue", () => {
        describe("when called by the issuer role", () => {
            it("scan issue a token & add it to storage", async () => {
                await soulboundERC721
                    .connect(context.users.user1)
                    .issue(context.users.user2.address)
            })
        })
        describe("when called by a non-issuer role", () => {
            it("reverts", async () => {
                expect(
                    await didRevert(
                        soulboundERC721
                            .connect(context.users.user1)
                            .issue(context.users.user2.address)
                    )
                )
            })
        })
    })

    describe("claim", () => {
        describe("when called with a pending claim", () => {
            it("mints the nft", async () => {
                await soulboundERC721
                    .connect(context.users.user1)
                    .issue(context.users.user2.address)
                await soulboundERC721.connect(context.users.user2).claim()

                const data = await context.soulboundStorage.getMintsByReceiver(
                    context.users.user2.address
                )
                expect(await soulboundERC721.ownerOf(0)).to.equal(context.users.user2.address)
                expect(data.length).to.equal(1)
                expect(data[0].collection).to.equal(soulboundERC721.address)
                expect(data[0].tokenId).to.equal(0)
                expect(data[0].completed).to.equal(true)
            })
        })
        describe("when called without a pending claim", () => {
            it("reverts", async () => {
                expect(await didRevert(soulboundERC721.connect(context.users.user2).claim()))
            })
        })
    })

    describe("tokenURI", () => {
        describe("should return the same URI for all token ids", () => {
            it("when called", async () => {
                expect(await soulboundERC721.tokenURI(0)).to.equal(URI)
            })
        })
    })

    describe("transferFrom", () => {
        describe("should revert", () => {
            it("when called", async () => {
                await soulboundERC721
                    .connect(context.users.user1)
                    .issue(context.users.user2.address)
                await soulboundERC721.connect(context.users.user2).claim()

                expect(
                    await didRevert(
                        soulboundERC721
                            .connect(context.users.user2)
                            .transferFrom(
                                context.users.user2.address,
                                context.users.user1.address,
                                0
                            )
                    )
                )
            })
        })
    })
})
