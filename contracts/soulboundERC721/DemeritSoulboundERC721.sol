// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./SoulboundERC721.sol";
import "../erc721Factory/demerit/IDemerit.sol";

contract DemeritSoulboundERC721 is SoulboundERC721 {
    IDemerit _demerit;

    constructor(
        address owner,
        address demerit,
        string memory name,
        string memory symbol,
        string memory uri
    ) SoulboundERC721(owner, name, symbol, uri) {
        _owner = owner;
        _uri = uri;
        _demerit = IDemerit(demerit);
        _revokeRole(ISSUER_ROLE, owner);
        _revokeRole(DEFAULT_ADMIN_ROLE, owner);
    }

    function assign(address receiver, uint64 dealId) public virtual {
        require(_demerit.canIssue(receiver, dealId), "Error: Receiver does not deserve this demerit.");
        mint(receiver);
    }
}
