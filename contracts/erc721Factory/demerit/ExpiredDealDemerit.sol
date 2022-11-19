// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IDemerit.sol";
import "../../filecoinMockAPIs/typeLibraries/MarketTypes.sol";
import "../../filecoinMockAPIs/MarketAPI.sol";
import "../../addressOracle/AddressOracle.sol";

contract ExpiredDealDemerit is IDemerit {
    MarketAPI _marketAPI;
    AddressOracle _addressOracle;

    constructor(address addressOracle, address marketAPI) {
        _addressOracle = AddressOracle(addressOracle);
        _marketAPI = MarketAPI(marketAPI);
    }

    function canIssue(address receiver, uint64 dealId) external view returns (bool) {
        bytes32 receiverHash = keccak256(abi.encodePacked(_addressOracle.getF0Address(receiver)));
        bytes32 clientHash = keccak256(abi.encodePacked(_marketAPI.get_deal_client(MarketTypes.GetDealClientParams(dealId)).client));
        int64 endData = _marketAPI.get_deal_term(MarketTypes.GetDealTermParams(dealId)).end;
        // TODO: I don't think endDate is block.number, its a int64. What is endDate, and how do we compare to current date?
        return receiverHash == clientHash && block.number > uint256(uint64(endData));
    }
}
