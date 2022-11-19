import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "../utils/Setup"
import { DemeritSoulboundERC721 } from "../../typechain-types"
import { didRevert } from "../utils/DidRevert"

describe("DemeritSoulboundERC721", () => {
    const NAME = "Name"
    const SYMBOL = "Symbol"
    const URI = "ipfs://hash"

    let context: Context
    let soulboundERC721: DemeritSoulboundERC721

    beforeEach(async () => {
        context = await Setup()

        await context.demeritFactory
            .connect(context.users.user1)
            .createCollection(NAME, SYMBOL, URI, context.expiredDealDemeritId)

        const collections = await context.soulboundStorage.getDeployedCollections(
            context.users.user1.address
        )

        soulboundERC721 = (await ethers.getContractAt(
            "DemeritSoulboundERC721",
            collections[0]
        )) as DemeritSoulboundERC721
    })

    describe("assign", () => {
        describe("should assign", () => {
            it("when end is earlier than current block", async () => {
                await context.marketAPI.create_mock(1337, "", 0)
                await soulboundERC721.assign(context.users.user2.address, 1337)
            })
        })
        describe("should revert", () => {
            it("when end is beyond current block", async () => {
                await context.marketAPI.create_mock(1337, "", 999999999)
                expect(
                    await didRevert(soulboundERC721.assign(context.users.user2.address, 1337))
                ).to.be.equal(true)
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
                await context.marketAPI.create_mock(1337, "", 0)
                await soulboundERC721.assign(context.users.user2.address, 1337)

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
