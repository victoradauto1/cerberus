// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CerberusPay is Ownable, Pausable, ReentrancyGuard{

    IERC20 public acceptedToken;

    uint public monthlyAmount = 0.001 ether;
    uint public constant thirtyDaysInSecondes = 30 * 24 * 60 * 60;

    mapping (address => uint) public payments;//customer => next payment
    address[] public customers;

    constructor() Ownable(msg.sender){

}