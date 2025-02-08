// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ECDSAServiceManagerBase} from "@eigenlayer-middleware/src/unaudited/ECDSAServiceManagerBase.sol";
import {ECDSAStakeRegistry} from "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import {IServiceManager} from "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {ECDSAUpgradeable} from "@openzeppelin-upgrades/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import {IERC1271Upgradeable} from "@openzeppelin-upgrades/contracts/interfaces/IERC1271Upgradeable.sol";
import {INeuralFiServiceManager} from "./INeuralFiServiceManager.sol";

/**
 * @title NeuralFiServiceManager - EigenLayer AVS for NeuralFi portfolio validation
 */
contract NeuralFiServiceManager is ECDSAServiceManagerBase, INeuralFiServiceManager {
    using ECDSAUpgradeable for bytes32;

    uint32 public latestTaskNum;

    // Mapping of task indices to portfolio task hashes
    mapping(uint32 => bytes32) public allTaskHashes;
    // Mapping of task indices to operator responses
    mapping(address => mapping(uint32 => bytes)) public taskResponses;
    // Mapping of task indices to validation status
    mapping(uint32 => TaskStatus) public taskStatus;

    modifier onlyOperator() {
        require(
            ECDSAStakeRegistry(stakeRegistry).operatorRegistered(msg.sender),
            "Not registered operator"
        );
        _;
    }

    constructor(
        address _avsDirectory,
        address _stakeRegistry,
        address _rewardsCoordinator,
        address _delegationManager
    )
        ECDSAServiceManagerBase(
            _avsDirectory,
            _stakeRegistry,
            _rewardsCoordinator,
            _delegationManager
        )
    {}

    function initialize(
        address initialOwner,
        address _rewardsInitiator
    ) external initializer {
        __ServiceManagerBase_init(initialOwner, _rewardsInitiator);
    }

    function createPortfolioTask(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint8 action
    ) external returns (PortfolioTask memory) {
        PortfolioTask memory newTask = PortfolioTask({
            tokenA: tokenA,
            tokenB: tokenB,
            amountA: amountA,
            amountB: amountB,
            action: action,
            taskCreatedBlock: uint32(block.number)
        });

        // Store task hash and emit event
        bytes32 taskHash = keccak256(abi.encode(newTask));
        allTaskHashes[latestTaskNum] = taskHash;
        taskStatus[latestTaskNum] = TaskStatus.Pending;
        
        emit NewTaskCreated(latestTaskNum, newTask);
        latestTaskNum++;

        return newTask;
    }

    function respondToTask(
        PortfolioTask calldata task,
        uint32 referenceTaskIndex,
        bytes memory signature
    ) external onlyOperator {
        // Verify task and check for duplicates
        require(
            keccak256(abi.encode(task)) == allTaskHashes[referenceTaskIndex],
            "Invalid task"
        );
        require(
            taskResponses[msg.sender][referenceTaskIndex].length == 0,
            "Already responded"
        );
        require(
            taskStatus[referenceTaskIndex] != TaskStatus.Completed,
            "Task already completed"
        );

        // Create message hash for validation
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                task.tokenA,
                task.tokenB,
                task.amountA,
                task.amountB,
                task.action
            )
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        // Verify signature using ECDSA registry
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        require(
            magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(
                ethSignedMessageHash,
                signature
            ),
            "Invalid signature"
        );

        // Store response and update status
        taskResponses[msg.sender][referenceTaskIndex] = signature;
        taskStatus[referenceTaskIndex] = TaskStatus.Completed;
        
        emit TaskResponded(referenceTaskIndex, task, msg.sender);
    }

    function getTaskStatus(uint32 taskIndex) external view returns (TaskStatus) {
        return taskStatus[taskIndex];
    }

    function getTaskResponse(uint32 taskIndex, address operator) external view returns (bytes memory) {
        return taskResponses[operator][taskIndex];
    }
}