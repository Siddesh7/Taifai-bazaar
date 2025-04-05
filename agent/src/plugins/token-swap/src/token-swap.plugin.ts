import {
  Chain,
  PluginBase,
  WalletClientBase,
  createTool,
} from "@goat-sdk/core";
import { z } from "zod";
import { CELO_TOKENS, getTokenAddress, getTokenName } from "./celo-tokens";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, celo } from "viem/chains";
export class TokenSwapPlugin extends PluginBase<WalletClientBase> {
  constructor() {
    super("tokenSwap", []);
  }

  // This plugin supports all chains
  supportsChain = (chain: Chain) => true;

  // Define tools directly in the plugin
  getTools(walletClient: WalletClientBase) {
    return [
      createTool(
        {
          name: "swap_tokens",
          description: "Swap one token for another",
          parameters: z.object({
            fromToken: z.string().describe("The token to swap from"),
            amount: z.string().describe("The amount to swap"),
            toToken: z
              .string()
              .optional()
              .describe("The token to swap to (optional)"),
            walletAddress: z
              .string()
              .describe("The wallet address to use for the swap"),
          }),
        },
        async (parameters) => {
          const fromToken = parameters.fromToken;
          const toToken = parameters.toToken || "CELO";

          // Look up token addresses
          const fromTokenAddress = getTokenAddress(fromToken);
          const toTokenAddress = getTokenAddress(toToken);
          const account = privateKeyToAccount(
            "0x807764482387d33a68919e64bcc4f75f29e7a7aa3af8fb496af1d08e77ca420f"
          );

          console.log("Account:", account);

          const walletClient = createWalletClient({
            account,
            transport: http("https://celo.drpc.org"),
            chain: celo,
          });

          const amountInWei = Math.floor(
            parseFloat(parameters.amount) * 10 ** 6
          ).toString();

          const hash = await walletClient.writeContract({
            address: "0x0c14591696e97c8824852143d430A786Fb3992Db",
            abi: [
              {
                inputs: [
                  {
                    internalType: "uint256",
                    name: "usdcAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "_tokenOut",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "_userWallet",
                    type: "address",
                  },
                ],
                name: "swap",
                outputs: [
                  {
                    internalType: "uint256",
                    name: "wethAmount",
                    type: "uint256",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
            ],
            functionName: "swap",
            args: [
              BigInt(amountInWei),
              toTokenAddress as `0x${string}`,
              parameters.walletAddress as `0x${string}`,
            ],
          });
          console.log("Transaction hash:", hash);

          return {
            tokenName: fromToken,
            tokenAddress: fromTokenAddress || "Unknown token",
            amount: parameters.amount,
            walletAddress: parameters.walletAddress,
            toToken: toToken,
            toTokenAddress: toTokenAddress || "Unknown token",
            transactionHash: hash,
          };
        }
      ),
      createTool(
        {
          name: "get_token_address",
          description: "Get the address for a given token name on Celo",
          parameters: z.object({
            tokenName: z.string().describe("The name of the token"),
          }),
        },
        async (parameters) => {
          const address = getTokenAddress(parameters.tokenName);
          return {
            tokenName: parameters.tokenName,
            address: address || "Token not found",
            found: !!address,
          };
        }
      ),
    ];
  }
}

// Export a factory function to create a new instance of the plugin
export const tokenSwap = () => new TokenSwapPlugin();
