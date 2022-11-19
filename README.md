# FEVM Hardhat Kit

# Deployments

{
  marketAPI: '0xD5896A115accfD9214eA90F84e0903884F3658F1',
  addressOracle: '0xA445d307569DD53695af6A769aa631c08b775840',

  soulboundStorage: '0x372D052fc27D39a300A249c514d6a03180E123A9',
  soulboundEngine: '0xD9D02b5dD74e1Ed6B25e93c157091834aeEc6669',
  
  openFactory: '0x49E18efFc1a27FD8BDD2A2b0f010cb570D8a9C6e',
  dealFactory: '0xc7FA90Db457A5B8A3dA2dff09aE89f35A51030ac',
  demeritFactory: '0x5d9471AcF3cC999c54e249E3e57D0F8751eEB822',

  expiredDealDemerit: '0x3f3D6961F13f401F5ba50C78C92CD18681756356',
  openFactoryId: '0xcfee7c08a98f4b565d124c7e4e28acc52e1bc780e3887db0a02a7d2d5bc66728',
  dealFactoryId: '0xe064fb3e72b2ec70782ecb932d7660de8155cfb2be5f0e925f55e7a33274bf5b',
  expiredDealDemeritId: '0x388d1e7253b891434333e1c6ba4bf1d97ab260bd8d3a37f728481319b7693cd0',
  demeritFactoryId: '0x8cc40ef9c36327f25b55eaa102815e920d910662a2b9303b012949c8a10c4d1d'
}

## Cloning the Repo

Open up your terminal (or command prompt) and navigate to a directory you would like to store this code on. Once there type in the following command:


```
git clone https://github.com/filecoin-project/FEVM-Hardhat-Kit.git
cd FEVM-hardhat-kit
yarn install
```


This will clone the hardhat kit onto your computer, switch directories into the newly installed kit, and install the dependencies the kit needs to work.


## Get a Private Key

You can get a private key from a wallet provider [such as Metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).


## Add your Private Key as an Environment Variable

Add your private key as an environment variable by running this command: 
 
 ```
export PRIVATE_KEY='abcdef'
```

 \
If you use a .env file, don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!


## Get the Deployer Address

Run this command:
```
yarn hardhat get-address
```

The f4address is the filecoin representation of your Ethereum address. This will be needed for the faucet in the next step.

The Ethereum address will be used otherwise.


## Fund the Deployer Address

Go to the [Wallaby faucet](https://wallaby.network/#faucet), and paste in the f4 address we copied in the previous step. This will send some wallaby testnet FIL to the account.


## Deploy the SimpleCoin Contract

Type in the following command in the terminal: 
 
 ```
yarn hardhat deploy
```

This will compile the contract and deploy it to the Wallaby network automatically!

Keep note of the deployed contract address for the next step.

If you read the Solidity code for SimpleCoin, you will see in the constructor our deployer account automatically gets assigned 10000 SimpleCoin when the contract is deployed.


## Read your SimpleCoin balance

Type in the following command in the terminal: 
 
 ```
yarn hardhat get-balance --contract 'THE DEPLOYED CONTRACT ADDRESS HERE' --account 'YOUR F4 ADDRESS HERE'
```

The console should read that your account has 10000 SimpleCoin!


## Deployment Task Steps
Deploy MarketAPI
Deploy AddressOracle

Deploy SoulboundEngine
Deploy SoulboundStorage(SoulboundEngine)
SoulboundEngine.registerEngine(SoulboundEngine)

Deploy OpenFactory
SoulboundEngine.registerFactory(keccak("default"), OpenFactory) 

Deploy DealFactory
SoulboundEngine.registerFactory(keccak("deal"), DealFactory) 

Deploy ExpiredDealDemerit(MarketAPI, AddressOracle)
Deploy DemeritFactory
DemeritFactory.registerDemerit(keccak("expired-deal", ExpiredDealDemerit))
SoulboundEngine.registerFactory(keccak("demerit"), DealFactory) 

## Usage

Only need SoulboundEngine's address known to frontend. Everything else is discoverable

SoulboundStorage = SoulboundEngine.getStorageAddress()

OpenFactory = OpenFactory(SoulboundEngine.getFactory(keccak("default")))
ERC721 = OpenFactory.createCollection("name", "symbol", "ipfs://hash")
ERC721.issue(receiver);
ERC721.claim();

SoulboundStorage = SoulboundEngine.getStorageAddress()
DemeritFactory = DemeritFactory(SoulboundEngine.getFactory(keccak("demerit")))
ERC721 = OpenFactory.createCollection("name", "symbol", "ipfs://hash")
ERC721.assign(receiver);

ERC721[] = SoulboundStorage.getDeployedCollections(deployer)
IssuerMints[] = SoulboundStorage.getIssuerMints(issuer)
bool = SoulboundStorage.wasMintCompleted(receiver, erc721)
ReceiverMints[] = SoulboundStorage.getReceiverMints()

## TODOs

Test Setup

Write tests

Deploy script

ABIs to frontend

wagmi = useContractRead(adresss, abi, provider, {
    pollingInterval
})
