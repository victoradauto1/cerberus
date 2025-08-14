// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CerberusPay is Ownable, Pausable, ReentrancyGuard {
    IERC20 public acceptedToken;

    uint public monthlyAmount = 0.001 ether;
    uint public constant thirtyDaysInSecondes = 30 * 24 * 60 * 60;

    mapping(address => uint) public payments; //customer => next payment
    address[] public customers;

    event Paid(address indexed customer, uint date, uint amount);

    constructor() Ownable(msg.sender) {
        acceptedToken = IERC20(0x0000000000000000000000000000000000001010); //WMATIC da rede POLYGON
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getCostumers() external view returns(address[] memory) {
        return customers;
    }

    function setAcceptedToken(address tokenAddress) external onlyOwner {
        acceptedToken = IERC20(tokenAddress);
    }

    function setMonthlyAmount(uint newAmount) external onlyOwner {
        monthlyAmount = newAmount;
    }

    function withdraw(uint amount) external onlyOwner nonReentrant {
        uint balance = acceptedToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");
        acceptedToken.transfer(owner(), amount);
    }

    function pay(address customer) external onlyOwner whenNotPaused{
        bool thirtyDaysHavePassed = payments[customer] <= block.timestamp;
        bool firstPayment = payments[customer] == 0;
        bool hasAmount = acceptedToken.balanceOf(customer) >= monthlyAmount;
        bool hasAllowance = acceptedToken.allowance(customer, address(this)) >= monthlyAmount;
        bool timeToPay = thirtyDaysHavePassed || firstPayment;

        if(!timeToPay) return;

        if(!hasAllowance || !hasAmount)
            revert("Insufficient balance and/or allowance");

        acceptedToken.transferFrom(customer, address(this), monthlyAmount);

        if(firstPayment)
            customers.push(customer);
        
        payments[customer] = block.timestamp + thirtyDaysInSecondes;

        emit Paid(customer, block.timestamp, monthlyAmount);

    }
}
