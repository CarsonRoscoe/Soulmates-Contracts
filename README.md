# FEVM Hackathon Notes

# Deployments

marketAPI: 0xD5896A115accfD9214eA90F84e0903884F3658F1

addressOracle: 0xA445d307569DD53695af6A769aa631c08b775840

soulboundStorage: 0x372D052fc27D39a300A249c514d6a03180E123A9

soulboundEngine: 0xD9D02b5dD74e1Ed6B25e93c157091834aeEc6669

openFactory: 0x49E18efFc1a27FD8BDD2A2b0f010cb570D8a9C6e

dealFactory: 0xc7FA90Db457A5B8A3dA2dff09aE89f35A51030ac

demeritFactory: 0x5d9471AcF3cC999c54e249E3e57D0F8751eEB822

expiredDealDemerit: 0x3f3D6961F13f401F5ba50C78C92CD18681756356

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
