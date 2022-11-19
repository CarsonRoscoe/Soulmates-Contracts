import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import { BigNumber, Contract } from "ethers"
import { task, types } from "hardhat/config"
import "hardhat-deploy"
import "hardhat-deploy-ethers"
import { DeployOptions } from "hardhat-deploy/dist/types"
import {
    SoulboundEngine,
    OpenFactory,
    DemeritFactory,
    DealFactory,
    SoulboundStorage,
    MarketAPI,
    AddressOracle,
    ExpiredDealDemerit,
} from "../typechain-types"

task(`deploy-suite`, `Deploy entire suite of contracts`).setAction(async (taskArgs, hre) => {
    const { ethers, run, deployments } = hre
    const { deploy: deployContract } = deployments

    console.log("Starting")
    const provider = new ethers.providers.JsonRpcProvider(
        "https://wallaby.node.glif.io/rpc/v0",
        31415
    )
    const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY as string, provider)

    const accounts = await ethers.getSigners()
    const signer2 = accounts[0]

    console.log("Awaiting provider ready")
    await provider.ready

    const signer = provider.getSigner(deployer.address)

    console.log("Awaiting fee data")

    let maxPriorityFee: BigNumber | null = null
    let attempt = 0
    while (maxPriorityFee == null) {
        try {
            maxPriorityFee = (await provider.getFeeData()).maxPriorityFeePerGas
        } catch (e) {
            attempt++
            if (attempt > 100) {
                break
            }
        }
    }

    const deploy = async (name: string, args: any[] = []) => {
        const deployResult = await deployContract(name, {
            from: deployer.address,
            args,
            // since it's difficult to estimate the gas before f4 address is launched, it's safer to manually set
            // a large gasLimit. This should be addressed in the following releases.
            gasLimit: 1000000000, // BlockGasLimit / 10
            // since Ethereum's legacy transaction format is not supported on FVM, we need to specify
            // maxPriorityFeePerGas to instruct hardhat to use EIP-1559 tx format
            maxPriorityFeePerGas: maxPriorityFee ?? undefined,
            log: true,
        })
        console.log(`${name} at address ${deployResult.address}`)
        return await hre.ethers.getContractAt(name, deployResult.address)
    }

    console.log("Awaiting deploys")
    const marketAPI = (await deploy("MarketAPI")) as MarketAPI
    const addressOracle = (await deploy("AddressOracle")) as AddressOracle

    const soulboundStorage = (await deploy("SoulboundStorage")) as SoulboundStorage
    const soulboundEngine = (await deploy("SoulboundEngine", [
        soulboundStorage.address,
    ])) as SoulboundEngine

    // const unsignedTransaction = await soulboundStorage.populateTransaction.registerEngine(
    //     soulboundEngine.address
    // )
    // const signedTransaction = await deployer.signTransaction(unsignedTransaction)
    // await soulboundStorage.connect(signer).registerEngine(soulboundEngine.address)

    // const result = await callRpc("eth_sendRawTransaction", [signedTransaction])

    const openFactory = (await deploy("OpenFactory", [soulboundStorage.address])) as OpenFactory
    const openFactoryId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("default"))
    // await soulboundEngine.connect(provider).registerFactory(openFactoryId, openFactory.address)

    const dealFactory = (await deploy("DealFactory", [
        soulboundStorage.address,
        addressOracle.address,
        marketAPI.address,
    ])) as DealFactory
    const dealFactoryId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("deal"))
    // await soulboundEngine.connect(signer).registerFactory(dealFactoryId, dealFactory.address)

    const expiredDealDemerit = (await deploy("ExpiredDealDemerit", [
        addressOracle.address,
        marketAPI.address,
    ])) as ExpiredDealDemerit
    const demeritFactory = (await deploy("DemeritFactory", [
        soulboundStorage.address,
    ])) as DemeritFactory
    const demeritFactoryId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("demerit"))
    // await soulboundEngine.connect(signer).registerFactory(demeritFactoryId, demeritFactory.address)

    const expiredDealDemeritId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("expired-deal"))
    // await demeritFactory
    //     .connect(signer)
    //     .registerDemerit(expiredDealDemeritId, expiredDealDemerit.address)

    // await addressOracle.connect(signer).setF0Address(deployer.address, "t01109")

    console.info({
        marketAPI: marketAPI.address,
        addressOracle: addressOracle.address,

        soulboundStorage: soulboundStorage.address,
        soulboundEngine: soulboundEngine.address,

        openFactory: openFactory.address,
        openFactoryId,

        dealFactory: dealFactory.address,
        dealFactoryId,

        expiredDealDemerit: expiredDealDemerit.address,
        expiredDealDemeritId,
        demeritFactory: demeritFactory.address,
        demeritFactoryId,
    })
})

export default {}
