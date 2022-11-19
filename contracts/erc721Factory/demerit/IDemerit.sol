// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IDemerit {
    function canIssue(address receiver, uint64 dealId) external returns (bool);
}
