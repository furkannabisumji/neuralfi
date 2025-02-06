import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";

dotenv.config();

// Wallet data storage
const WALLET_DATA_FILE = "wallet_data.txt";

// Environment validation
function validateEnvironment() {
  const requiredVars = [
    "OPENAI_API_KEY",
    "CDP_API_KEY_NAME",
    "CDP_API_KEY_PRIVATE_KEY",
  ];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars);
    process.exit(1);
  }
}

// Initialize agent
async function initializeAgent() {
  const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
  });

  // Read or create wallet
  let walletDataStr: string | null = null;
  if (fs.existsSync(WALLET_DATA_FILE)) {
    walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
  }

  // Configure wallet provider
  const config = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);

  // Initialize AgentKit with providers
  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      wethActionProvider(),
      pythActionProvider(),
      walletActionProvider(),
      erc20ActionProvider(),
      cdpApiActionProvider(config),
      cdpWalletActionProvider(config),
    ],
  });

  const tools = await getLangChainTools(agentkit);
  const memory = new MemorySaver();

  // Create the agent
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `You are a helpful blockchain agent using Coinbase Developer Platform AgentKit.`,
  });

  // Save wallet data
  const exportedWallet = await walletProvider.exportWallet();
  fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

  return { agent, config: { configurable: { thread_id: "CDP Agent" } } };
}

// Chat mode
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const input = await new Promise<string>((resolve) =>
      rl.question("\nPrompt: ", resolve)
    );
    if (input === "exit") break;

    const stream = await agent.stream(
      {
        messages: [new HumanMessage(input.toString())],
      },
      config
    );

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        console.log(chunk.agent.messages[0].content);
      }
    }
  }
  rl.close();
}

// Main function
async function main() {
  validateEnvironment();
  try {
    const { agent, config } = await initializeAgent();
    await runChatMode(agent, config);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Start the agent
if (require.main === module) {
  console.log("Starting Agent...");
  main();
}
