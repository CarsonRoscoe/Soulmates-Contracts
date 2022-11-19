import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "./../utils/Setup"
import { DemeritSoulboundERC721, SoulboundERC721 } from "../../typechain-types"


describe("DemeritFactory", () => {
    let context: Context

    const NAME = "foo"
    const SYMBOL = "bar"
    const URI = "ipfs://hash"
    const DEAL_ID = 1
    const END = 0

    beforeEach(async () => {
        context = await Setup()
    })

    describe("create collection", () => {
            it("should create a demerit soulbound collection and assign", async() => {
                await context.demeritFactory
                    .connect(context.users.user1)                         
                    .createCollection(NAME, SYMBOL, URI, context.expiredDealDemeritId)

                const collections = await context.soulboundStorage.getDeployedCollections(context.users.user1.address)

                const demeritSoulboundERC721 = (await ethers.getContractAt(
                    "DemeritSoulboundERC721",
                    collections[0]
                )) as DemeritSoulboundERC721

                expect(await demeritSoulboundERC721.name()).to.equal(NAME)
                expect(await demeritSoulboundERC721.symbol()).to.equal(SYMBOL)
                expect(await demeritSoulboundERC721.tokenURI(1)).to.equal("URI")
            })
    })
})
