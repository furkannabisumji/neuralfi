// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NeuralFi is Ownable {

    struct Investment {
        address token;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Investment[]) public userInvestments;
    address[] users;
    IERC20 public stablecoin;
    address yield;

    event Invested(address indexed user, address token, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, address token, uint256 amount, uint256 timestamp);

    constructor(address _stablecoin) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
    }

    function setYield(address _yield) external onlyOwner{
        require(yield==address(0), "Already set");
        yield = _yield;
    }

    function deposit(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        userInvestments[msg.sender].push(Investment(token, amount, block.timestamp));
        users.push(msg.sender);
        emit Invested(msg.sender, token, amount, block.timestamp);
    }

    function withdraw(uint256 index) external {
        Investment memory investment = userInvestments[msg.sender][index];
        require(investment.amount > 0, "No investment found");
        IERC20(investment.token).transfer(msg.sender, investment.amount);
        delete userInvestments[msg.sender][index];
        for(uint256 i = 0; i < users.length; i++) {
            if(users[i]==msg.sender && userInvestments[msg.sender].length==0){
                delete users[i];
            }
        }
        emit Withdrawn(msg.sender, investment.token, investment.amount, block.timestamp);
    }
}
