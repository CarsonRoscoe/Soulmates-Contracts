// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract AddressOracle {
  mapping(address => string) f0ByEth;

  constructor() {
    f0ByEth[0xE67e1f24A637F84BE1E68D547022dE8883a0d89B] = "t01109";
  }

  function setF0Address(address ethereumAddress, string memory f0Address) public {
    f0ByEth[ethereumAddress] = f0Address;
  }

  function getF0Address(address ethereumAddress) public view returns (string memory) {
    return f0ByEth[ethereumAddress];
  }
}
