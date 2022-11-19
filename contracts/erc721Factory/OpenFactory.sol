// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./ERC721Factory.sol";


// contract DealFactory is ERC721Factory {
//     function createCollection(string name, string symbol, uint64 dealId) public returns(address) {
//         // Get client
//         // Get label
//         // Validate client == msg.sender
//         return createSoulboundCollection(name, symbol, uri);
//     }
//     //
// }

contract OpenFactory is ERC721Factory {
    function createCollection(string memory name, string memory symbol, string memory uri) public returns(address) {
        return createSoulboundCollection(name, symbol, uri);
    }
}
