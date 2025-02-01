// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NeuralFi.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";

contract YieldAggregator is Ownable {
    address public agent;
    NeuralFi neuralfi;
    IUniswapV2Router02 public uniswapRouter;
    IPool public aavePool;

    constructor(
        address _neuralfi,
        address _agent,
        address _uniswapRouter,
        address _aavePool
    ) Ownable(msg.sender) {
        neuralfi = NeuralFi(_neuralfi);
        agent = _agent;
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        aavePool = IPool(_aavePool);
    }

    modifier onlyAgent() {
        require(msg.sender == agent, "Unauthorised");
        _;
    }

    function swapOnUniswap(address _tokenIn, address _tokenOut, uint256 _amount) external onlyAgent {
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        
        IERC20(_tokenIn).approve(address(uniswapRouter), _amount);
        uniswapRouter.swapExactTokensForTokens(
            _amount,
            0,
            path,
            address(this),
            block.timestamp
        );
    }

     function addLiquidityOnUniswap(address tokenA, address tokenB) external onlyAgent {
        uint amountADesired;
        uint amountBDesired;
        IERC20(tokenA).approve(address(uniswapRouter), amountADesired);
        IERC20(tokenA).approve(address(uniswapRouter), amountBDesired);
        uniswapRouter.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, 0, 0, address(neuralfi), block.timestamp);
    }

    function depositToAave(address _token, uint256 _amount) external onlyAgent {
        IERC20(_token).approve(address(aavePool), _amount);
        aavePool.supply(_token, _amount, address(this), 0);
    }
}
