// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage{
    function store(uint256 _favNum) public override{
        favNum = _favNum + 5;
    }
}
