// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./SoulboundERC721.sol";
import "../erc721Factory/demerit/IDemerit.sol";

contract DemeritSoulboundERC721 is SoulboundERC721 {
    IDemerit _demerit;

    constructor(
        address owner,
        address soulboundStorage,
        address demerit,
        string memory name,
        string memory symbol,
        string memory uri
    ) SoulboundERC721(owner, soulboundStorage, name, symbol, uri) {
        _owner = owner;
        _uri = uri;
        _demerit = IDemerit(demerit);
        _revokeRole(ISSUER_ROLE, owner);
        _revokeRole(DEFAULT_ADMIN_ROLE, owner);
    }

    // TODO: Override supports interface so frontend can discover assign function

    function assign(address receiver, uint64 dealId) public virtual {
        require(_demerit.canIssue(receiver, dealId), "Error: Receiver does not deserve this demerit.");
        _soulboundStorage.addIssuedToken(msg.sender, receiver, address(this));
        mint(receiver);
    }
}
