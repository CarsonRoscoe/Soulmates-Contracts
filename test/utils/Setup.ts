import { ContractFactory, Signer } from "ethers"
import { keccak256 } from "ethers/lib/utils"
import { ethers } from "hardhat"
import { SignerWithAddress } from "hardhat-deploy-ethers/signers"
import {
    SoulboundEngine,
    OpenFactory,
    DemeritFactory,
    DealFactory,
    SoulboundStorage,
    MarketAPI,
    AddressOracle,
    ExpiredDealDemerit,
} from "../../typechain-types"

interface Users {
    deployer: SignerWithAddress
    user1: SignerWithAddress
    user2: SignerWithAddress
}

export async function deploy(contractName: string, deployer: SignerWithAddress, args: any[] = []) {
    const factory = await ethers.getContractFactory(contractName)
    const contract = await factory.connect(deployer).deploy(...args)
    return contract
}

export interface Context {
    nullAddress: string
    users: Users

    marketAPI: MarketAPI
    addressOracle: AddressOracle

    soulboundStorage: SoulboundStorage
    soulboundEngine: SoulboundEngine

    openFactory: OpenFactory
    openFactoryId: string
    dealFactory: DealFactory
    dealFactoryId: string
    demeritFactory: DemeritFactory
    demeritFactoryId: string

    expiredDealDemerit: ExpiredDealDemerit
    expiredDealDemeritId: string
}

export async function Setup(): Promise<Context> {
    const [deployer, user1, user2] = await ethers.getSigners()

    const users: Users = {
        deployer,
        user1,
        user2,
    }

    const marketAPI = (await deploy("MarketAPI", deployer)) as MarketAPI
    const addressOracle = (await deploy("AddressOracle", deployer)) as AddressOracle

    const soulboundStorage = (await deploy("SoulboundStorage", deployer)) as SoulboundStorage
    const soulboundEngine = (await deploy("SoulboundEngine", deployer, [
        soulboundStorage.address,
    ])) as SoulboundEngine
    await soulboundStorage.connect(deployer).registerEngine(soulboundEngine.address)

    const openFactory = (await deploy("OpenFactory", deployer, [
        soulboundStorage.address,
    ])) as OpenFactory
    const openFactoryId = keccak256(ethers.utils.toUtf8Bytes("default"))
    await soulboundEngine.registerFactory(openFactoryId, openFactory.address)

    const dealFactory = (await deploy("DealFactory", deployer, [
        soulboundStorage.address,
        addressOracle.address,
        marketAPI.address,
    ])) as DealFactory
    const dealFactoryId = keccak256(ethers.utils.toUtf8Bytes("deal"))
    await soulboundEngine.registerFactory(dealFactoryId, dealFactory.address)

    const expiredDealDemerit = (await deploy("ExpiredDealDemerit", deployer, [
        addressOracle.address,
        marketAPI.address,
    ])) as ExpiredDealDemerit
    const demeritFactory = (await deploy("DemeritFactory", deployer, [
        soulboundStorage.address,
    ])) as DemeritFactory
    const demeritFactoryId = keccak256(ethers.utils.toUtf8Bytes("demerit"))
    await soulboundEngine.registerFactory(demeritFactoryId, demeritFactory.address)

    const expiredDealDemeritId = keccak256(ethers.utils.toUtf8Bytes("expired-deal"))
    await demeritFactory.registerDemerit(expiredDealDemeritId, expiredDealDemerit.address)

    return {
        nullAddress: "0x0000000000000000000000000000000000000000",
        users,

        marketAPI,
        addressOracle,

        soulboundStorage,
        soulboundEngine,

        openFactory,
        openFactoryId,

        dealFactory,
        dealFactoryId,

        expiredDealDemerit,
        expiredDealDemeritId,
        demeritFactory,
        demeritFactoryId,
    }
}
