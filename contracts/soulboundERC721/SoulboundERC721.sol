// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ISoulboundERC721.sol";

contract SoulboundERC721 is ERC721, ISoulboundERC721 {
    uint256 _nextTokenId;
    mapping(address => bool) _claims;
    address _owner;
    string _uri;

    constructor(address owner, string memory name, string memory symbol, string memory uri) ERC721(name, symbol) {
        _owner = owner;
        _uri = uri;
    }

    function issue(address receiver) public {
        // require(msg.sender == _owner);
        // Should we restrict receivers to only receive one soulbound per collection?
        _claims[receiver] = true;
    }

    // Student claims school's token
    function claim() public {
        require(_claims[msg.sender] == true, "ERROR: No issue to claim.");
        _safeMint(msg.sender, _nextTokenId++);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _uri;
    }

    //// Prevent transfers ////


        /**
     * @dev See {IERC721-transferFrom}.
     */
     function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        revert("ERROR: Souldbound tokens cannot be transferred.");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        revert("ERROR: Souldbound tokens cannot be transferred.");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        revert("ERROR: Souldbound tokens cannot be transferred.");
    }
}
