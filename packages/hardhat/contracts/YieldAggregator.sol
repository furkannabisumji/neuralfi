// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NeuralFi.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract YieldAggregator is Ownable {
    address public agent;
    NeuralFi public neuralfi;
    IUniswapV2Router02 public uniswapRouter;

    event LiquidityAdded(address indexed tokenA, address indexed tokenB, uint256 liquidity);
    event LiquidityRemoved(address indexed user, address indexed tokenA, address indexed tokenB, uint256 liquidity);

    constructor(address _neuralfi, address _agent, address _uniswapRouter) Ownable(msg.sender) {
        neuralfi = NeuralFi(_neuralfi);
        agent = _agent;
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }

    modifier onlyAgentOrNeuralfi() {
        require(msg.sender == agent || msg.sender == address(neuralfi), "Unauthorized");
        _;
    }

     modifier onlyNeuralfi() {
        require(msg.sender == address(neuralfi), "Unauthorized");
        _;
    }

    function addLiquidity(address tokenA, address tokenB) external onlyAgentOrNeuralfi {
        uint256 totalAmountA;
        uint256 totalAmountB;
        address[] memory users = neuralfi.getUsers();
        uint256[] memory userInvestments = new uint256[](users.length);
        for (uint256 i = 0; i < users.length; i++) {
            NeuralFi.Investment[] memory investments = neuralfi.getInvestment(users[i]);
            for (uint256 j = 0; j < investments.length; j++) {
                address userToken = investments[j].token;
                uint256 amount = investments[j].balance;
                if (userToken != tokenA && userToken != tokenB) {
                    uint256 swappedAmountA = swapTokens(userToken, tokenA, amount / 2);
                    uint256 swappedAmountB = swapTokens(userToken, tokenB, amount / 2);
                    totalAmountA += swappedAmountA;
                    totalAmountB += swappedAmountB;
                    userInvestments[i] = swappedAmountA + swappedAmountB;
                } else {
                    totalAmountA += userToken == tokenA ? amount : 0;
                    totalAmountB += userToken == tokenB ? amount : 0;
                    userInvestments[i] = amount;
                }
            }

            require(totalAmountA > 0 && totalAmountB > 0, "Insufficient funds");

            IERC20(tokenA).approve(address(uniswapRouter), totalAmountA);
            IERC20(tokenB).approve(address(uniswapRouter), totalAmountB);

            address pair = getPair(tokenA, tokenB);
            uint256 lpBefore = IERC20(pair).balanceOf(address(this));

            (, , uint256 liquidity) = uniswapRouter.addLiquidity(
                tokenA,
                tokenB,
                totalAmountA,
                totalAmountB,
                0,
                0,
                address(this),
                block.timestamp
            );

            uint256 totalLP = IERC20(pair).balanceOf(address(this)) - lpBefore;

            for (uint256 k = 0; k < users.length; k++) {
                if (userInvestments[i] > 0) {
                    neuralfi.newTx(
                        users[k],
                        tokenA,
                        tokenB,
                        (userInvestments[k] * totalLP) / (totalAmountA + totalAmountB),
                        0,
                        0
                    );
                }
                emit LiquidityAdded(tokenA, tokenB, liquidity);
            }
        }
    }

    function removeLiquidity(address user, address tokenA, address tokenB) external onlyAgentOrNeuralfi {
        address pair = getPair(tokenA, tokenB);
        require(pair != address(0), "Invalid pair");

        if (user == address(0)) {
            address[] memory users = neuralfi.getUsers();
            for (uint256 i = 0; i < users.length; i++) {
                _removeLiquidity(users[i], address(this), tokenA, tokenB, pair);
            }
        } else {
            _removeLiquidity(user, user, tokenA, tokenB, pair);
        }
    }
    function _removeLiquidity(address user, address to, address tokenA, address tokenB, address pair) internal {
        uint256 lpAmount = neuralfi.userLP(user, tokenA, tokenB);
        require(lpAmount > 0, "No LP to remove");

        IERC20(pair).approve(address(uniswapRouter), lpAmount);

        (uint256 amountA, uint256 amountB) = uniswapRouter.removeLiquidity(
            tokenA,
            tokenB,
            lpAmount,
            0,
            0,
            to,
            block.timestamp
        );
        if (to == address(this)) {
            neuralfi.newTx(user, tokenA, tokenB, amountA, amountB, 1);
        }
        emit LiquidityRemoved(user, tokenA, tokenB, lpAmount);
    }

    function swapTokens(address _tokenIn, address _tokenOut, uint256 _amount) internal returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        IERC20(_tokenIn).approve(address(uniswapRouter), _amount);
        uint256[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            _amount,
            0,
            path,
            address(this),
            block.timestamp
        );

        return amounts[amounts.length - 1];
    }

    function withdraw(address user, address token, uint256 amount) external onlyNeuralfi{
    IERC20(token).transfer(user, amount);
    }
    function getPair(address tokenA, address tokenB) internal view returns (address) {
        return IUniswapV2Factory(uniswapRouter.factory()).getPair(tokenA, tokenB);
    }
}
