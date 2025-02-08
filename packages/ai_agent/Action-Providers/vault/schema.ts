import { z } from "zod";

/**
 * Input schema for checking vault balance.
 */
export const GetVaultBalanceSchema = z
  .object({
    address: z.string().describe("The address to check the vault balance for"),
  })
  .strip()
  .describe("Instructions for getting vault balance");

/**
 * Input schema for deposit action.
 */
export const DepositSchema = z
  .object({
    amount: z
      .custom<bigint>()
      .describe("The amount of ETH to deposit (in wei)"),
  })
  .strip()
  .describe("Instructions for depositing ETH into the vault");

/**
 * Input schema for withdraw action.
 */
export const WithdrawSchema = z
  .object({
    amount: z
      .custom<bigint>()
      .describe("The amount of ETH to withdraw (in wei)"),
  })
  .strip()
  .describe("Instructions for withdrawing ETH from the vault");
