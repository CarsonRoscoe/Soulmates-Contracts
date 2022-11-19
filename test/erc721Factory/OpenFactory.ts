import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "./../utils/Setup"
import { SoulboundERC721 } from "../../typechain-types"


describe("OpenFactory", () => {
    let context: Context

    const NAME = "foo"
    const SYMBOL = "bar"
    const URI = "ipfs://hash"

    beforeEach(async () => {
        context = await Setup()
    })

    describe("create collection", () => {
            it("should create a soulbound collection", async() => {
                await context.openFactory.connect(context.users.user1).createCollection(NAME, SYMBOL, URI)

                const collections = await context.soulboundStorage.getDeployedCollections(
                    context.users.user1.address)
                
                const soulboundERC721 = (await ethers.getContractAt(
                    "SoulboundERC721",
                    collections[0]
                )) as SoulboundERC721

                expect(await soulboundERC721.name()).to.equal(NAME)
                expect(await soulboundERC721.symbol()).to.equal(SYMBOL)
                expect(await soulboundERC721.tokenURI(1)).to.equal(URI)
            })
    })
})
