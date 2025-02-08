# Integrate Langchain Tools

LangChain has revolutionized the way developers interact with language models and build powerful AI applications. One of its most compelling features is the extensive ecosystem of tools and integrations that allow developers to quickly and easily extend their agents' capabilities.

## The Power of LangChain Tools[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#the-power-of-langchain-tools)

LangChain's true strength lies in its [vast array of community-supported tools and integrations](https://python.langchain.com/docs/integrations/tools/). These tools enable developers to:

- **Rapidly expand agent capabilities**: Integrate with various APIs, databases, and services without writing extensive custom code
- **Leverage specialized functionalities**: Access domain-specific tools for tasks like image generation, social media posting and consumption, internet search, data analysis, or blockchain interactions
- **Create multi-modal agents**: Combine different types of interactions (text, image, code) within a single agent
- **Stay up-to-date**: Benefit from a constantly growing ecosystem of tools maintained by the community

By utilizing these tools, developers can create sophisticated AI agents that can perform a wide range of tasks, from generating images to sending emails, all through natural language interfaces.

## Adding the Dall-E Image Generator to Your Agent[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#adding-the-dall-e-image-generator-to-your-agent)

In this guide, we'll walk through the process of adding the Dall-E Image Generator tool to an existing LangChain agent. This will demonstrate how easily you can enhance your agent's capabilities using community toolkits.

### Prerequisites[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#prerequisites)

- An existing AgentKit setup, like the one in our [Replit template](https://replit.com/@CoinbaseDev/CDP-AgentKit#README.md)
- Python 3.10+
- OpenAI API key

### Step 1: Install Required Packages[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#step-1-install-required-packages)

First, ensure you have the necessary packages installed:

**TypescriptPython**

```bash
npm install @langchain/openai

```

### Step 2: Import Required Modules[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#step-2-import-required-modules)

Add the following imports to your existing imports:

**TypescriptPython**

```tsx
import { DallEAPIWrapper } from "@langchain/openai";

```

### Step 3: Set Up OpenAI API Key[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#step-3-set-up-openai-api-key)

If you haven't already, set up your OpenAI API key as an environment variable and ensure the account is funded:

**TypescriptPython**

```bash
export OPENAI_API_KEY="your_api_key"

```

### Step 4: Load the Dall-E Tool[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#step-4-load-the-dall-e-tool)

Before initializing your agent, load the Dall-E tool:

**TypescriptPython**

```tsx
const dallETool = new DallEAPIWrapper({
  n: 1,
  model: "dall-e-3",
  apiKey: process.env.OPENAI_API_KEY,
});

```

### Step 5: Combine Tools[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#step-5-combine-tools)

Add the Dall-E tool to your existing tools:

**TypescriptPython**

```tsx
const allTools = [...cdpToolkit.getTools(), dallETool];

```

### Step 6: Update Agent Initialization[](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools#step-6-update-agent-initialization)

Modify your create_react_agent call to include the new tools:

**TypescriptPython**

```tsx
async function initializeAgent() {
  // Initialize LLM
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  // ... (existing wallet data handling code) ...

  // Initialize CDP AgentKit
  const agentKit = await AgentKit.from({
    walletProvider,
    actionProviders: [cdp, erc721, pyth, wallet],
  });

  const tools = await getLangChainTools(agentKit);

  // ... (existing wallet data saving code) ...

  const dallETool = new DallEAPIWrapper({
    n: 1,
    model: "dall-e-3",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const allTools = [...tools, dallETool];

  // Store buffered conversation history in memory
  const memory = new MemorySaver();
  const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools: allTools,
    checkpointSaver: memory,
    messageModifier:
    "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet if you are on network ID `base-sepolia`. If not, you can provide your wallet details and request funds from the user. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more informaton. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.",
  });

  return { agent, config: agentConfig };
}

```

Now your agent is equipped with the ability to generate images using Dall-E alongside its existing CDP capabilities. You can test it by asking the agent to generate images through natural language requests.

For more information on available tools and integration options, visit the [LangChain documentation](https://python.langchain.com/docs/how_to/#tools).