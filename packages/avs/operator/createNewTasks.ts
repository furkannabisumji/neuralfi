import { ethers } from "ethers";
import * as dotenv from "dotenv";
const fs = require('fs');
const path = require('path');
dotenv.config();

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const chainId = 31337;

const avsDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/neuralfi/${chainId}.json`), 'utf8'));
const neuralFiServiceManagerAddress = avsDeploymentData.addresses.neuralFiServiceManager;
const neuralFiServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/NeuralFiServiceManager.json'), 'utf8'));

const neuralFiServiceManager = new ethers.Contract(neuralFiServiceManagerAddress, neuralFiServiceManagerABI, wallet);

const TEST_TOKENS = [
  "0x1234567890123456789012345678901234567890", 
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012"  
];

function generateRandomPortfolioTask() {
  const tokenIndexA = Math.floor(Math.random() * TEST_TOKENS.length);
  let tokenIndexB = (tokenIndexA + 1) % TEST_TOKENS.length;
  
  const amountA = ethers.parseEther((Math.random() * 9.9 + 0.1).toString());
  const amountB = ethers.parseEther((Math.random() * 9.9 + 0.1).toString());
  
  const action = Math.floor(Math.random() * 2);
  
  return {
    tokenA: TEST_TOKENS[tokenIndexA],
    tokenB: TEST_TOKENS[tokenIndexB],
    amountA,
    amountB,
    action
  };
}

async function createNewPortfolioTask() {
  try {
    const task = generateRandomPortfolioTask();
    console.log(`Creating new portfolio task:`, task);
    
    const tx = await neuralFiServiceManager.createPortfolioTask(
      task.tokenA,
      task.tokenB,
      task.amountA,
      task.amountB,
      task.action
    );
    
    const receipt = await tx.wait();
    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error('Error creating portfolio task:', error);
  }
}

function startCreatingTasks() {
  setInterval(() => {
    console.log("Creating new portfolio task...");
    createNewPortfolioTask();
  }, 24000);
}

// Start the process
startCreatingTasks();