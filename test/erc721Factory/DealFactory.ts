import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "./../utils/Setup"
import { SoulboundERC721 } from "../../typechain-types"

describe("DealFactory", () => {
    let context: Context

    const NAME = "foo"
    const SYMBOL = "bar"
    const DEAL_URI = 1
    const LABEL = "hash"
    const END = 1000
    const DEAL_CLIENT = "t01109"

    beforeEach(async () => {
        context = await Setup()
    })

    describe("create collection", () => {
        it("should create a soulbound collection", async () => {
            // create a mock deal with the deal URI. the deal factory was constructed with the market api already
            context.marketAPI.create_mock(DEAL_URI, LABEL, END)

            // set up address oracle to return the right address
            context.addressOracle.setF0Address(context.users.user1.address, DEAL_CLIENT)

            await context.dealFactory
                .connect(context.users.user1)
                .createSoulboundCollection(NAME, SYMBOL, DEAL_URI)

            const collections = await context.soulboundStorage.getDeployedCollections(
                context.users.user1.address
            )

            const soulboundERC721 = (await ethers.getContractAt(
                "SoulboundERC721",
                collections[0]
            )) as SoulboundERC721

            expect(await soulboundERC721.name()).to.equal(NAME)
            expect(await soulboundERC721.symbol()).to.equal(SYMBOL)
            expect(await soulboundERC721.tokenURI(1)).to.equal("ipfs://" + LABEL)
        })
    })
})
