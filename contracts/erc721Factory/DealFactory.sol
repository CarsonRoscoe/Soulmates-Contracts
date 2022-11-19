// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ERC721Factory.sol";
import "../filecoinMockAPIs/typeLibraries/MarketTypes.sol";
import "../filecoinMockAPIs/MarketAPI.sol";
import "../addressOracle/AddressOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract DealFactory is ERC721Factory, Ownable {
    MarketAPI _marketAPI;
    AddressOracle _addressOracle;


    function setAddressOracle(address oracle) public onlyOwner {
        _addressOracle = AddressOracle(oracle);
    }

    function setMarketAPI(address marketAPI) public onlyOwner {
        _marketAPI = MarketAPI(marketAPI);
    }

    function createCollection(string memory name, string memory symbol, uint64 dealId) public returns(address) {
        string memory client = _marketAPI.get_deal_client(MarketTypes.GetDealClientParams(dealId)).client;
        string memory label = _marketAPI.get_deal_label(MarketTypes.GetDealLabelParams(dealId)).label;
        string memory uri = string(abi.encodePacked("ipfs://", label));

        require(keccak256(abi.encodePacked((_addressOracle.getF0Address(msg.sender)))) == keccak256(abi.encodePacked((client))), "ERROR: Only callable by the deal's client");

        return createSoulboundCollection(name, symbol, uri);
    }
}