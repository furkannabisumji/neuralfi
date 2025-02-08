// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {NeuralFiDeploymentLib} from "./utils/NeuralFiDeploymentLib.sol";
import {CoreDeploymentLib} from "./utils/CoreDeploymentLib.sol";
import {UpgradeableProxyLib} from "./utils/UpgradeableProxyLib.sol";
import {StrategyBase} from "@eigenlayer/contracts/strategies/StrategyBase.sol";
import {ERC20Mock} from "../test/ERC20Mock.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {StrategyFactory} from "@eigenlayer/contracts/strategies/StrategyFactory.sol";
import {StrategyManager} from "@eigenlayer/contracts/core/StrategyManager.sol";
import {IRewardsCoordinator} from "@eigenlayer/contracts/interfaces/IRewardsCoordinator.sol";

import {
    Quorum,
    StrategyParams,
    IStrategy
} from "@eigenlayer-middleware/src/interfaces/IECDSAStakeRegistryEventsAndErrors.sol";

import "forge-std/Test.sol";

contract NeuralFiDeployer is Script {
    using CoreDeploymentLib for *;
    using UpgradeableProxyLib for address;

    address private deployer;
    address proxyAdmin;
    address rewardsOwner;
    address rewardsInitiator;
    IStrategy neuralFiStrategy;
    CoreDeploymentLib.DeploymentData coreDeployment;
    NeuralFiDeploymentLib.DeploymentData neuralFiDeployment;
    NeuralFiDeploymentLib.DeploymentConfigData neuralFiConfig;
    Quorum internal quorum;
    ERC20Mock token;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        vm.label(deployer, "Deployer");

        neuralFiConfig = NeuralFiDeploymentLib.readDeploymentConfigValues(
            "config/neuralfi/", 
            block.chainid
        );

        coreDeployment = CoreDeploymentLib.readDeploymentJson(
            "deployments/core/", 
            block.chainid
        );
    }

    function run() external {
        vm.startBroadcast(deployer);
        rewardsOwner = neuralFiConfig.rewardsOwner;
        rewardsInitiator = neuralFiConfig.rewardsInitiator;

        token = new ERC20Mock();
        neuralFiStrategy = IStrategy(
            StrategyFactory(coreDeployment.strategyFactory).deployNewStrategy(token)
        );

        quorum.strategies.push(
            StrategyParams({strategy: neuralFiStrategy, multiplier: 10_000})
        );

        proxyAdmin = UpgradeableProxyLib.deployProxyAdmin();

        neuralFiDeployment = NeuralFiDeploymentLib.deployContracts(
            proxyAdmin,
            coreDeployment,
            quorum,
            rewardsInitiator,
            rewardsOwner
        );

        neuralFiDeployment.strategy = address(neuralFiStrategy);
        neuralFiDeployment.token = address(token);

        vm.stopBroadcast();
        verifyDeployment();
        NeuralFiDeploymentLib.writeDeploymentJson(neuralFiDeployment);
    }

    function verifyDeployment() internal view {
        require(
            neuralFiDeployment.stakeRegistry != address(0), 
            "StakeRegistry address cannot be zero"
        );
        require(
            neuralFiDeployment.neuralFiServiceManager != address(0),
            "NeuralFiServiceManager address cannot be zero"
        );
        require(
            neuralFiDeployment.strategy != address(0), 
            "Strategy address cannot be zero"
        );
        require(
            proxyAdmin != address(0), 
            "ProxyAdmin address cannot be zero"
        );
        require(
            coreDeployment.delegationManager != address(0),
            "DelegationManager address cannot be zero"
        );
        require(
            coreDeployment.avsDirectory != address(0), 
            "AVSDirectory address cannot be zero"
        );
    }
}