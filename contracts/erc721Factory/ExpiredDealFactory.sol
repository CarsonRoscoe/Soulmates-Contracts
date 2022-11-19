// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ERC721Factory.sol";
import "../filecoinMockAPIs/MarketAPI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// TODO: Base on whether a deal is expired??

contract ExpiredDealFactory is ERC721Factory, Ownable {
    MarketAPI _marketAPI;

    function setMarketAPI(address marketAPI) public onlyOwner {
        _marketAPI = MarketAPI(marketAPI);
    }

    function createCollection(string memory name, string memory symbol, uint64 dealId) public returns(address) {
        return createSoulboundCollection(name, symbol, "");
    }
}