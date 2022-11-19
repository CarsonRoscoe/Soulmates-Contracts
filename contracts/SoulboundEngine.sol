// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./erc721Factory/OpenFactory.sol";
import "./erc721Factory/ERC721Factory.sol";

interface IERC721Factory {

}

contract SoulboundEngine {
    mapping(bytes32 => address) erc721Factories;

    constructor() {
    }

    function registerFactory(bytes32 _keccakId, address erc721Factory) public {
        require(erc721Factories[_keccakId] == address(0), "Error: Factory already registered with this id.");
        erc721Factories[_keccakId] = erc721Factory;
    }

    function getFactory(bytes32 _keccakId) public view returns (address) {
        return erc721Factories[_keccakId];
    }
}
