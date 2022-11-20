# FEVM Hackathon Notes

# Deployments

marketAPI: 0x9f200b5B96F3056413c8D06f818329BAb90516Dc
addressOracle: 0x28F27756933D1ff9b336de5C46d7175a7b172CB5

soulboundStorage: 0x80E245356679e7AC316C438B819b0BE350032776
soulboundEngine: 0xED968D821c9aE6d9FCE4eC48319235dEC6946BaE

openFactory: 0x12d22F4582d92F001f666Da19a8DA3e55a3E5Ade
dealFactory: 0x2B1b3De04C4b79825BC0E5215AE1dA051814E080
demeritFactory: 0x2B1b3De04C4b79825BC0E5215AE1dA051814E080

expiredDealDemerit: 0x05b6C60B769dd659CA5cD8af3D2d60A362F49506

# Abis frontend will need for hackathon scope

SoulboundStorage
OpenFactory
DealFactory
DemeritFactory
SoulboundERC721
DemericSoulboundERC721

# Frontend Calls

## SoulboundStorage.getDeployedCollections(address deployer)

Returns an array of all ERC721's deployed by the owner

## SoulboundStorage.getMintsByIssuer(address issuer)

Returns an array of all assigns, pending & confirmed, by the issuer

## SoulboundStorage.wasMintConfirm(address receiver, address erc721)

Returns true or false about whether a mint was confirmed (forced or claimed). If true, the user owns the nft. If false, it's still pending

## SoulboundStorage.getMintsByReceiver(address receiver)

Returns the tokens a receiver has been assigned, both claimed and unclaimed. If 'completed' is false, the token is unclaimed, and tokenId should be ignore. If 'completed' is true, then the tokenId was minted & set

## OpenFactory.createCollection(string name, string symbol, string uri)

Creates a new SoulboundERC721 collection

## DealFactory.createCollection(string name, string symbol, int64 dealId)

Creates a new SoulboundERC721 collection if the caller does own the deal listed

## DemeritFactory.createCollection(string name, string symbol, bytes32 demeritId)

Creates a new DemeritSoulboundERC721 collection, whose issuance is governed by the associated demeritId

## SoulboundERC721.issue(address user)

Assigns a pending mint to a user (only callable by the owner)

## SoulboundERC721.claim()

Claims a token if a pending one exists for the caller

## DemeritERC721.assign(address user, uint64 dealId)

If the associated demerit rules pass and the users deserves it, mints a demerit to the user
