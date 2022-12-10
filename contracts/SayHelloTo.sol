// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SayHelloTo {
    string public to;
    event ToChange(string to);

    constructor() {
        to = "World";
    }

    function changeTo(string calldata _to) public {
        require(bytes(_to).length > 0);
        to = _to;
        emit ToChange(to);
    }

    function sayHello() public view returns (string memory){
        return string.concat("Hello ", to);
    }
}