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
import { rootstock, celo } from "viem/chains";

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
            toToken: z.string().optional().describe("The token to swap to "),
            walletAddress: z
              .string()
              .describe("The wallet address to use for the swap"),
            isRootstock: z
              .boolean()
              .optional()
              .describe("Whether to use Rootstock chain for the swap"),
          }),
        },
        async (parameters) => {
          try {
            console.warn(parameters);
            const fromToken = parameters.fromToken;
            const toToken = parameters.toToken;
            let isRootstock = parameters.isRootstock || false;

            if (!toToken) {
              throw new Error("toToken is required");
            }

            // Explicitly check for Rootstock tokens to ensure isRootstock is set properly
            if (
              !isRootstock &&
              (fromToken.toUpperCase() === "RBTC" ||
                fromToken.toUpperCase() === "DOC" ||
                fromToken.toUpperCase() === "RIF" ||
                fromToken.toUpperCase() === "SOV" ||
                fromToken.toUpperCase() === "BPRO" ||
                fromToken.toUpperCase() === "RUSDT" ||
                toToken?.toUpperCase() === "RBTC" ||
                toToken?.toUpperCase() === "DOC" ||
                toToken?.toUpperCase() === "RIF" ||
                toToken?.toUpperCase() === "SOV" ||
                toToken?.toUpperCase() === "BPRO" ||
                toToken?.toUpperCase() === "RUSDT")
            ) {
              console.log(
                "Rootstock tokens detected. Setting isRootstock to true."
              );
              isRootstock = true;
            }

            // Look up token addresses
            const fromTokenAddress = getTokenAddress(fromToken, isRootstock);
            const toTokenAddress = getTokenAddress(toToken, isRootstock);

            if (!fromTokenAddress) {
              throw new Error(`Unknown token: ${fromToken}`);
            }

            if (!toTokenAddress) {
              throw new Error(`Unknown token: ${toToken}`);
            }

            const account = privateKeyToAccount("");

            console.log("Account:", account);

            // Set the chain and contract address based on whether it's Rootstock or not
            const chain = isRootstock ? rootstock : celo;
            const contractAddress = isRootstock
              ? "0xF9816F5CD44092F6d57b167b559fA237069Fe0FF"
              : "0x0c14591696e97c8824852143d430A786Fb3992Db";

            // Set the RPC URL based on the chain
            const rpcUrl = isRootstock
              ? "https://mycrypto.rsk.co"
              : "https://celo.drpc.org";

            const walletClient = createWalletClient({
              account,
              transport: http(rpcUrl),
              chain,
            });

            // Convert the amount to Wei - making sure to handle decimal amounts correctly
            // For USDC, we use 6 decimals as per token standard
            const amountFloat = parseFloat(parameters.amount);
            if (isNaN(amountFloat) || amountFloat <= 0) {
              throw new Error("Invalid amount. Must be a positive number.");
            }

            // For small amounts, need to ensure we're not rounding down to zero
            // Minimum amount should be at least 1 (one unit in the smallest denomination)
            const amountInWei = Math.max(1, Math.floor(amountFloat * 10 ** 6));

            console.log([
              BigInt(amountInWei),
              toTokenAddress as `0x${string}`,
              parameters.walletAddress as `0x${string}`,
            ]);

            const hash = await walletClient.writeContract({
              address: contractAddress as `0x${string}`,
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
              tokenAddress: fromTokenAddress,
              amount: parameters.amount,
              walletAddress: parameters.walletAddress,
              toToken: toToken,
              toTokenAddress: toTokenAddress,
              transactionHash: hash,
              chain: isRootstock ? "Rootstock" : "Celo",
            };
          } catch (error) {
            console.error("Error in swap_tokens:", error);

            // Return a user-friendly error with details
            return {
              success: false,
              error: `Failed to swap tokens: ${
                (error as Error).message || "Unknown error"
              }`,
              details:
                "The token swap transaction could not be completed. Please try again with a larger amount or different token pair.",
            };
          }
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
