// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface INeuralFiServiceManager {
    enum TaskStatus {
        None,
        Pending,
        Completed
    }

    struct PortfolioTask {
        address tokenA;
        address tokenB;
        uint256 amountA;
        uint256 amountB;
        uint8 action; // 0: Add liquidity, 1: Remove liquidity
        uint32 taskCreatedBlock;
    }

    event NewTaskCreated(uint32 indexed taskIndex, PortfolioTask task);
    event TaskResponded(uint32 indexed taskIndex, PortfolioTask task, address operator);

    function latestTaskNum() external view returns (uint32);
    
    function allTaskHashes(uint32 taskIndex) external view returns (bytes32);
    
    function taskResponses(address operator, uint32 taskIndex) external view returns (bytes memory);
    
    function createPortfolioTask(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint8 action
    ) external returns (PortfolioTask memory);
    
    function respondToTask(
        PortfolioTask calldata task,
        uint32 referenceTaskIndex,
        bytes memory signature
    ) external;
    
    function getTaskStatus(uint32 taskIndex) external view returns (TaskStatus);
    
    function getTaskResponse(uint32 taskIndex, address operator) external view returns (bytes memory);
}