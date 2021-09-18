// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WavePortal {
    using Counters for Counters.Counter;
    Counters.Counter private _waverIndex;
    mapping(address => uint256) private _wavesIndex;
    Wave[] private _waves;

    struct Wave {
        uint256 index;
        address owner;
        string display_name;
        string message;
        uint256 created_at;
    }

    struct WaveDto {
        string display_name;
        string message;
        uint256 created_at;
    }

    constructor() {
        console.log("I am a Wave Portal smart contract, owner: ", msg.sender);
    }

    function wave(WaveDto memory dto) public {
        _waverIndex.increment();
        _waves.push(
            Wave({
                index: _waverIndex.current(),
                owner: msg.sender,
                display_name: dto.display_name,
                message: dto.message,
                created_at: dto.created_at
            })
        );
        _wavesIndex[msg.sender] = _waverIndex.current();

        console.log("%s just waved", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        return _waves.length;
    }

    function hasWaved() public view returns (bool) {
        console.log('_wavesIndex[msg.sender]', _wavesIndex[msg.sender]);
        return _wavesIndex[msg.sender] >= 0;
    }

    function getWaves() public view returns (Wave[] memory) {
        return _waves;
    }
}
