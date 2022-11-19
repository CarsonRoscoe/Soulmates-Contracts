require("dotenv").config()
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "hardhat-deploy-ethers"
import "./tasks"
import "./tasks/deploy-suite"

const PRIVATE_KEY = process.env.PRIVATE_KEY
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.17",
    defaultNetwork: "hardhat",
    networks: {
        wallaby: {
            url: "https://wallaby.node.glif.io/rpc/v0",
            accounts: [PRIVATE_KEY],
            chainId: 31415,
        },
        goerli: {
            url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [PRIVATE_KEY],
        },
        hardhat: {},
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v5",
        alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
        externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
        dontOverrideCompile: false, // defaults to false
    },
}
