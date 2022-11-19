// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./erc721Factory/OpenFactory.sol";

contract SoulboundEngine {
    uint256 id;
    mapping(uint256 => address) erc721Factories;

    function createFactory() public {
        OpenFactory openFactory = new OpenFactory();
        erc721Factories[id++] = address(openFactory);
    }

    function registerFactory(address erc721Factory) public {
        erc721Factories[id++] = erc721Factory;
    }

    function getFactory(uint256 _id) public view returns(address) {
        return erc721Factories[_id];
    }
}
