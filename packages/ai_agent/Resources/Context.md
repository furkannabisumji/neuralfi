# Quickstart (Section 1)

Getting AgentKit running is easy. This guide will show you how to get started using the CDP Wallet API, though we support [arbitrary wallet providers](https://docs.cdp.coinbase.com/agentkit/docs/wallet-management).

## Using the Template[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#using-the-template)

The fastest way to get started is by using our [NodeJS](https://replit.com/@lincolnmurr/AgentKitjs-Quickstart-010?v=1) or [Python](https://replit.com/@CoinbaseDev/CDP-AgentKit#README.md) Replit templates or cloning the [repository](https://github.com/coinbase/agentkit/).

**ReplitLocal Environment**

### Step 1: Set Up Your Development Environment[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#step-1-set-up-your-development-environment)

1. Fork the template from [NodeJS](https://replit.com/@lincolnmurr/AgentKitjs-Quickstart-010?v=1) or [Python (legacy)](https://replit.com/@CoinbaseDev/CDP-AgentKit#README.md) Replit templates
2. Once forked, you'll have your own version of the project to modify

### Step 2: Configure Environment Variables[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#step-2-configure-environment-variables)

1. Click on "Tools" in the left sidebar
2. Select "Secrets"
3. Add the following secrets:

```
CDP_API_KEY_NAME=your_cdp_key_name
CDP_API_KEY_PRIVATE_KEY=your_cdp_private_key
OPENAI_API_KEY=your_openai_key # Or XAI_API_KEY if using the NodeJS template
NETWORK_ID="base-sepolia" # Optional, defaults to base-sepolia
MNEMONIC_PHRASE=your_mnemonic_phrase # Optional, if it is not provided the agent will create a new wallet

```

### Step 3: Run the Agent[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#step-3-run-the-agent)

You can start this chatbot by clicking the "Run" button.



Security of wallets on Replit template

Every agent comes with an associated wallet. Wallet data is read from wallet_data.txt, and if that file does not exist, this repl will create a new wallet and persist it in a new file. Please note that this contains your wallet's private key and should not be used in production environments. Refer to the [CDP docs](https://docs.cdp.coinbase.com/wallet-api/docs/wallets#securing-a-wallet) on how to secure your wallets.

## Starting from scratch with Langchain[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#starting-from-scratch-with-langchain)

For developers who want more control over their agent implementation, you can start from scratch using Langchain integration.

### Prerequisites[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#prerequisites)

**TypescriptPython**

- [Node.js 18+](https://nodejs.org/en/download/package-manager)
- [npm 9.7.2+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [CDP API Key](https://cdp.coinbase.com/)
- API keys to the LLM of your choice (we recommend [OpenAI](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key))
- A fresh directory

### Installation[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#installation)

**TypescriptPython**

To use the CDP AgentKit Toolkit with LangChain, first install the required packages:

```bash
npm install @coinbase/agentkit @coinbase/agentkit-langchain @langchain/openai @langchain/core @langchain/langgraph viem

```

### Environment Setup[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#environment-setup)

Set the required environment variables:

```bash
# CDP API credentials
export CDP_API_KEY_NAME="your-cdp-key-name"
export CDP_API_KEY_PRIVATE_KEY="your-cdp-private-key"

# LLM API key (we'll use OpenAI for this guide)
export OPENAI_API_KEY="your-openai-key"

# Optional configurations
export NETWORK_ID="base-sepolia"  # Optional, defaults to base-sepolia

```

Create a `.env` file in your project root with these variables:

```
CDP_API_KEY_NAME=your-cdp-key-name
CDP_API_KEY_PRIVATE_KEY=your-cdp-private-key
OPENAI_API_KEY=your-openai-key
NETWORK_ID=base-sepolia

```



Note

Make sure to add `.env` to your `.gitignore` file to prevent committing sensitive information.

### Creating Your First Agent[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#creating-your-first-agent)

**TypescriptPython**

Let's break down the implementation into several parts from the [chatbot.ts example file](https://github.com/coinbase/agentkit/blob/main/examples/chatbot/chatbot.ts):

### 1. Required Imports[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#1-required-imports)

First, we need to import all necessary dependencies:

```tsx
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

```

### 2. Environment Validation[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#2-environment-validation)

Add environment variable validation to ensure required variables are set:

```tsx
/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];

  // Check required variables
  const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // Warn about optional NETWORK_ID
  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}

// Add this right after imports and before any other code
validateEnvironment();

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt";

```

### 3. Agent Initialization[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#3-agent-initialization)

The `initializeAgent` function sets up our agent with all necessary components:

```tsx
/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  try {
    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    let walletDataStr: string | null = null;

    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
        // Continue without wallet data
      }
    }

    // Configure CDP Wallet Provider
    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);

    // Initialize AgentKit
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      ],
    });

    const tools = await getLangChainTools(agentkit);

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    // Create React Agent using the LLM and CDP AgentKit tools
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request
        funds from the user. Before executing your first action, get the wallet details to see what network
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone
        asks you to do something you can't do with your currently available tools, you must say so, and
        encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to
        docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from
        restating your tools' descriptions unless it is explicitly requested.
        `,
    });

    // Save wallet data
    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

```

### 4. Agent Interaction Modes[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#4-agent-interaction-modes)

The following code provides two ways to interact with the agent: chat mode and autonomous mode. You can modify or extend these based on your needs:

```tsx
/**
 * Run the agent autonomously with specified intervals
 */
async function runAutonomousMode(agent: any, config: any, interval = 10) {
  console.log("Starting autonomous mode...");

  while (true) {
    try {
      const thought =
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions and execute it that highlights your abilities.";

      const stream = await agent.stream({ messages: [new HumanMessage(thought)] }, config);

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }

      await new Promise(resolve => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}

/**
 * Run the agent interactively based on user input
 */
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  try {
    while (true) {
      const userInput = await question("\nPrompt: ");

      if (userInput.toLowerCase() === "exit") {
        break;
      }

      const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Choose whether to run in autonomous or chat mode
 */
async function chooseMode(): Promise<"chat" | "auto"> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  while (true) {
    console.log("\nAvailable modes:");
    console.log("1. chat    - Interactive chat mode");
    console.log("2. auto    - Autonomous action mode");

    const choice = (await question("\nChoose a mode (enter number or name): "))
      .toLowerCase()
      .trim();

    if (choice === "1" || choice === "chat") {
      rl.close();
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      rl.close();
      return "auto";
    }
    console.log("Invalid choice. Please try again.");
  }
}

/**
 * Main entry point
 */
async function main() {
  try {
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();

    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      await runAutonomousMode(agent, config);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

// Start the agent when running directly
if (require.main === module) {
  console.log("Starting Agent...");
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

```

This implementation provides a flexible foundation that you can customize based on your needs. The agent can:

- Run in interactive chat mode where users can directly communicate with it
- Run in autonomous mode where it performs actions at regular intervals
- Be extended with additional action providers for more functionality
- Use CDP's MPC Wallet Provider for secure key management
- Be integrated with any LLM supported by LangChain

### Adding Agent Functionality[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#adding-agent-functionality)

Extend your agent with chat capabilities. To add more functionality, see the [Add Agent Capabilities](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities) guide.

### Testing Your Agent[](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#testing-your-agent)

Try these example interactions:

```bash
You: What is your wallet address?
You: transfer .001 ETH to 0x4c8bbcfc6DaE447228FcbB220C1DD4cae623EaaF
You: Register a basename for yourself that represents your identity

```


