// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./YieldAggregator.sol";

contract NeuralFi is Ownable {
    struct Investment {
        address token;
        uint256 amount;
        uint256 balance;
        uint256 timestamp;
    }

    YieldAggregator aggregator;

    mapping(address => bool) allowedTokens;

    mapping(address => mapping(address => mapping(address => uint256))) public userLP;

    struct UserLPs {
        address tokenA;
        address tokenB;
    }

    mapping(address => UserLPs[]) userLps;

    mapping(address => Investment[]) public userInvestments;
    address[] users;
    address yield;

    event Invested(address indexed user, address token, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, address token, uint256 amount, uint256 timestamp);

    constructor(address _aggregator) Ownable(msg.sender) {
        aggregator = YieldAggregator(_aggregator);
    }

    modifier onlyYield() {
        require(yield == msg.sender, "Unauthorised");
        _;
    }
    function setYield(address _yield) external onlyOwner {
        require(yield == address(0), "Already set");
        yield = _yield;
    }

    function setToken(address _token, bool _allow) external onlyOwner {
        allowedTokens[_token] = _allow;
    }
    function deposit(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(allowedTokens[token] || token == address(0), "Invalid token");
        IERC20(token).transferFrom(msg.sender, address(yield), amount);
        userInvestments[msg.sender].push(Investment(token, amount, amount, block.timestamp));
        users.push(msg.sender);
        emit Invested(msg.sender, token, amount, block.timestamp);
    }

    function withdrawAll() external {
        Investment[] memory investments = getInvestment(msg.sender);
        for(uint256 k = 0; k<investments.length; k++){
            aggregator.withdraw(msg.sender, investments[k].token, investments[k].balance);
            emit Withdrawn(msg.sender, investments[k].token, investments[k].balance, block.timestamp);
        }
        delete userInvestments[msg.sender];
        UserLPs[] memory lps = getLPs(msg.sender);
        for(uint256 i = 0; i< lps.length; i++){
        aggregator.removeLiquidity(msg.sender, lps[i].tokenA, lps[i].tokenB);
        userLP[msg.sender][lps[i].tokenA][lps[i].tokenB] = 0;
        delete userLps[msg.sender][i];
        }
    }

    function newTx(
        address user,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint8 action
    ) public onlyYield {
        if (action == 0) {
            userLP[user][tokenA][tokenB] += amountA;
            userLps[user].push(UserLPs(tokenA, tokenB));
            Investment[] memory investments = getInvestment(user);
            for (uint256 i = 0; i < investments.length; i++) {
                userInvestments[user][i].balance = 0;
            }
        }

        if (action == 1) {
            userInvestments[msg.sender].push(Investment(tokenA, amountA, amountA, block.timestamp));
            userInvestments[msg.sender].push(Investment(tokenB, amountB, amountB, block.timestamp));
        }
    }

    function getUsers() external view returns (address[] memory) {
        return users;
    }

    function getInvestment(address user) public view returns (Investment[] memory) {
        return userInvestments[user];
    }

    function getLPs(address user) public view returns (UserLPs[] memory) {
        return userLps[user];
    }
}
