
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IERC721Factory {
    function getDeployedCollections(address deployer) external view returns(address[] memory);
}