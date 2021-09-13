// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint totalWaves;

    constructor() {
        console.log("I am a Wave Portal smart contract");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s just waved", msg.sender);
    }

    function getTotalWaves() public view returns (uint) {
        return totalWaves;
    }
}
