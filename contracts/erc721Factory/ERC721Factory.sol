// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../soulboundERC721/SoulboundERC721.sol";

abstract contract ERC721Factory {
    mapping(string => address) soulboundCollections;

    function createSoulboundCollection(string memory name, string memory symbol, string memory uri) internal returns(address) {
        require(soulboundCollections[name] == address(0), "Error: A factory has already been registered to name.");

        address collection = address(new SoulboundERC721(msg.sender, name, symbol, uri));
        soulboundCollections[name] = collection;
        
        return collection;
    }
}
