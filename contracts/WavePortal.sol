// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WavePortal {
    using Counters for Counters.Counter;
    Counters.Counter private _waverIndex;
    Wave[] private _waves;

    struct Wave {
        uint256 index;
        address owner;
        string display_name;
        string message;
        uint256 created_at;
    }

    event WaveCreated(
        uint256 index,
        address owner,
        string display_name,
        string message,
        uint256 created_at
    );

    struct WaveDto {
        string display_name;
        string message;
    }

    constructor() {
        console.log("I am a Wave Portal smart contract, owner: ", msg.sender);
    }

    function wave(WaveDto memory dto) public {
        _waverIndex.increment();
        Wave memory newWave = Wave({
            index: _waverIndex.current(),
            owner: msg.sender,
            display_name: dto.display_name,
            message: dto.message,
            created_at: block.timestamp
        });
        _waves.push(newWave);

        emit WaveCreated(
            newWave.index,
            newWave.owner,
            newWave.display_name,
            newWave.message,
            newWave.created_at
        );

        console.log("%s just waved", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        return _waverIndex.current();
    }

    function getWaves() public view returns (Wave[] memory) {
        return _waves;
    }
}
