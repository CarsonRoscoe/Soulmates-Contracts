// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ERC721Factory.sol";
import "../filecoinMockAPIs/MarketAPI.sol";
import "../addressOracle/AddressOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../soulboundERC721/DemeritSoulboundERC721.sol";

contract DemeritFactory is ERC721Factory, Ownable {
    mapping(bytes32 => address) _demerits;

    constructor(address soulboundStorage) ERC721Factory(soulboundStorage) {
    }

    function registerDemerit(bytes32 demeritId, address demerit) public {
        require(_demerits[demeritId] == address(0), "Error: Demerit already registered to that id");
        _demerits[demeritId] = demerit;
    }

    function createCollection(
        string memory name,
        string memory symbol,
        string memory uri,
        bytes32 demeritId
    ) public returns (address) {
        return createSoulboundCollection(name, symbol, uri, demeritId);
    }

    function createSoulboundCollection(
        string memory name,
        string memory symbol,
        string memory uri,
        bytes32 data
    ) internal virtual override returns (address) {
        require(_demerits[data] != address(0), "Error: Demerits require a registered IDemerit implementation.");

        address collection = address(new DemeritSoulboundERC721(msg.sender, address(_soulboundStorage), _demerits[data], name, symbol, uri));
        registerCollection(name, collection, msg.sender);

        return collection;
    }
}
