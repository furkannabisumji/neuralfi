# Add Agent Capabilities

We highly encourage extending the agent's functionality through new onchain interactions and APIs, or by introducing new Langchain tools.

Any function that can be written in Python or TypeScript can be made a command for an agent.

## Add existing Langchain tools[](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#add-existing-langchain-tools)

You can easily extend your agent's capabilities by incorporating additional Langchain tools. See [Integrating LangChain Tools](https://docs.cdp.coinbase.com/agentkit/docs/integrate-langchain-tools).

## Add Custom functionality (using AI or manually)[](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#add-custom-functionality-using-ai-or-manually)

To make the process as simple as possible, AgentKit supports adding custom functionality in multiple ways. Below are examples of how to add message signing functionality:

**TypescriptPython**

### Adding Actions to your Action Provider[](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#adding-actions-to-your-action-provider)

### Simple Option within your chatbot.ts file[](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#simple-option-within-your-chatbotts-file)

For quick testing or actions you don't plan to contribute to the repo, you can use the `customActionProvider` helper.

```tsx
const customSignMessage = customActionProvider<EvmWalletProvider>({ // wallet types specify which providers can use this action. It can be as generic as WalletProvider or as specific as CdpWalletProvider
  name: "sign_message",
  description: "Sign arbitrary messages using EIP-191 Signed Message Standard hashing",
  schema: z.object({
    message: z.string().describe("The message to sign"),
  }),
  invoke: async (walletProvider, args: any) => {
    const { message } = args;
    const signature = await walletProvider.signMessage(message);
    return `The payload signature ${signature}`;
  },
});

const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [customSignMessage],
});

```

### Adding Actions for contribution[](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#adding-actions-for-contribution)

Actions are defined as instance methods on the action provider class with the `@CreateAction` decorator. Actions can use a wallet provider or not and always return a Promise that resolves to a string.

See the [contribution guide](https://github.com/coinbase/agentkit/blob/master/CONTRIBUTING.md) for more details.

**Hint:** Use LLMs to generate the schema and action provider, so all you need to define is the function.

1. Define the action schema. Action schemas are defined using the `zod` library.

```tsx
import { z } from "zod";

export const SignMessageSchema = z.object({
  message: z.string().describe("The message to sign. e.g. `hello world`"),
});

```

1. Define the action provider.

```tsx
import { ActionProvider, WalletProvider, Network, CreateAction } from "@coinbase/agentkit";

class MyActionProvider extends ActionProvider<WalletProvider> {
    constructor() {
        super("my-action-provider", []);
    }

    @CreateAction({
        name: "my-action",
        description: "My action description",
        schema: MyActionSchema,
    })
    async myAction(args: z.infer<typeof MyActionSchema>): Promise<string> {
        return args.myField;
    }

    supportsNetwork = (network: Network) => true;
}

export const myActionProvider = () => new MyActionProvider();

```

1. Add the action provider to your AgentKit instance:

```tsx
const agentKit = new AgentKit({
  cdpApiKeyName: "CDP API KEY NAME",
  cdpApiKeyPrivate: "CDP API KEY PRIVATE KEY",
  actionProviders: [myActionProvider()],
});

```

## Contribute to the toolkit[](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#contribute-to-the-toolkit)

If you go through the additional effort to formally add CDP SDK functionality in a way that's compatible with the package, please submit a PR so we can consider including it in future releases!