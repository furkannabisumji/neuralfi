import { z } from "zod";
import {
  Network,
  EvmWalletProvider,
  ActionProvider
} from "@coinbase/agentkit";

import { CreateAction } from "@coinbase/agentkit";

import { GetVaultBalanceSchema, DepositSchema, WithdrawSchema } from "./schema";
import { VAULT_CONTRACT_ADDRESS, abi } from "./constant";
import { encodeFunctionData, Hex } from "viem";

/**
 * VaultActionProvider is an action provider for interacting with the Vault contract.
 * It provides functionality for checking balances, depositing ETH, and withdrawing ETH.
 */
export class VaultActionProvider extends ActionProvider<EvmWalletProvider> {
  private readonly contractAddress: Hex = VAULT_CONTRACT_ADDRESS as Hex;

  /**
   * Constructor for the VaultActionProvider.
   */
  constructor() {
    super("vault", []);
  }

  /**
   * Gets the vault balance for a specific address.
   *
   * @param walletProvider - The wallet provider to interact with the blockchain.
   * @param args - The input arguments containing the address to check.
   * @returns A message containing the vault balance.
   */
  @CreateAction({
    name: "get_vault_balance",
    description: `
    This tool will check the vault balance for a specific address.
    The balance represents the amount of ETH deposited in the vault.
    `,
    schema: GetVaultBalanceSchema,
  })

  
  public async getBalance(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetVaultBalanceSchema>
  ): Promise<string> {
    try {
      const balance = await walletProvider.readContract({
        address: this.contractAddress,
        abi,
        functionName: "balances",
        args: [args.address as Hex],
      });

      return `Vault balance for ${args.address} is ${balance} wei`;
    } catch (error) {
      return `Error checking vault balance: ${error}`;
    }
  }

  /**
   * Deposits ETH into the vault.
   *
   * @param walletProvider - The wallet provider to interact with the blockchain.
   * @param args - The input arguments containing the amount to deposit.
   * @returns A message containing the transaction details.
   */
  @CreateAction({
    name: "deposit",
    description: `
    This tool will deposit ETH into the vault.
    The amount should be specified in wei.
    Ensure you have sufficient ETH balance for both the deposit and gas fees.
    `,
    schema: DepositSchema,
  })
  public async deposit(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof DepositSchema>
  ): Promise<string> {
    try {
      const hash = await walletProvider.sendTransaction({
        to: this.contractAddress,
        value: args.amount,
        data: encodeFunctionData({
          abi,
          functionName: "deposit",
          args: [args.amount],
        }),
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully deposited ${args.amount} wei into the vault.\nTransaction hash: ${hash}`;
    } catch (error) {
      return `Error depositing to vault: ${error}`;
    }
  }

  /**
   * Withdraws ETH from the vault.
   *
   * @param walletProvider - The wallet provider to interact with the blockchain.
   * @param args - The input arguments containing the amount to withdraw.
   * @returns A message containing the transaction details.
   */
  @CreateAction({
    name: "withdraw",
    description: `
    This tool will withdraw ETH from the vault.
    The amount should be specified in wei.
    You can only withdraw up to your deposited balance.
    `,
    schema: WithdrawSchema,
  })
  public async withdraw(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof WithdrawSchema>
  ): Promise<string> {
    try {
      const hash = await walletProvider.sendTransaction({
        to: this.contractAddress,
        data: encodeFunctionData({
          abi,
          functionName: "withdraw",
          args: [args.amount],
        }),
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Successfully withdrew ${args.amount} wei from the vault.\nTransaction hash: ${hash}`;
    } catch (error) {
      return `Error withdrawing from vault: ${error}`;
    }
  }

  /**
   * Checks if the vault action provider supports the given network.
   * Currently supports all networks where the vault contract is deployed.
   *
   * @param _ - The network to check.
   * @returns True if the vault action provider supports the network.
   */
  public supportsNetwork(_: Network): boolean {
    return true;
  }
}

export const vaultActionProvider = () => new VaultActionProvider();
