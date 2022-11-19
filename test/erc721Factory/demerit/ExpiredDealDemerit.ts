import { ethers } from "hardhat"
import { expect } from "chai"
import { arrayify } from "ethers/lib/utils"
import { Contract } from "ethers"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import { Context, Setup } from "./../../utils/Setup"
import { SoulboundERC721 } from "../../../typechain-types"



describe("ExpiredDealDemerit", () => {
    let context: Context
    const DEAL_ID = 1

    beforeEach(async () => {
        context = await Setup()
    })

    describe("issue a demerit", () => {
        it("should succeed because block is greater than end data", async() => {
            await context.marketAPI.create_mock(DEAL_ID, "", 0)
            const result = await context.expiredDealDemerit.canIssue(context.users.user2.address, DEAL_ID)
            expect(result).to.equal(true)
        })
        it("should fail because block is less than end date", async() => {
            await context.marketAPI.create_mock(DEAL_ID, "", 999999)
            const result = await context.expiredDealDemerit.canIssue(context.users.user2.address, DEAL_ID)
            expect(result).to.equal(false)
        })
        it("should fail due to wrong receiver", async() => {
            await context.marketAPI.create_mock(DEAL_ID, "", 0)
            const result = await context.expiredDealDemerit.canIssue(context.users.user1.address, DEAL_ID)
            expect(result).to.equal(false)
        })
    })
})
