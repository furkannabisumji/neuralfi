# Action Providers

This folder contains examples of how to create custom actions in Coinbase CDP (Coinbase Developer Platform).

## Default Implementation: ERC20 Actions

The ERC20 implementation (`erc20` folder) serves as a reference example showing how to create custom actions. It implements common ERC20 token operations:

### Available Actions

1. `get_balance`: Retrieves the balance of an ERC20 token
   - Input: Contract address of the token
   - Returns: Token balance for the wallet

2. `transfer`: Transfers ERC20 tokens to another address
   - Inputs:
     - amount: Amount to transfer
     - contractAddress: Token contract address
     - destination: Recipient address (supports ENS and Base names)
   - Returns: Transaction confirmation with hash

### Implementation Details

The implementation consists of:

- `erc20ActionProvider.ts`: Main provider class that extends `ActionProvider`
- `schemas.ts`: Zod schemas defining the input validation
- `constants.ts`: ERC20 ABI definitions

Key components:

1. Action Decorator:
