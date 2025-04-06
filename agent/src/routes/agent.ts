import express, { Request, Response, Router } from "express";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, celo } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { coingecko } from "@goat-sdk/plugin-coingecko";
// Import our custom token swap plugin
import { tokenSwap } from "../plugins/token-swap/src";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router: Router = express.Router();

// Initialize wallet client
const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account,
  transport: http(process.env.RPC_PROVIDER_URL as string),
  chain: baseSepolia,
});

interface AgentRequestBody {
  prompt: string;
  isRootstock?: boolean;
}

// Agent route
router.post(
  "/message",
  async (
    req: Request<{}, any, AgentRequestBody>,
    res: Response
  ): Promise<void> => {
    const { prompt, isRootstock = false } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res
        .status(400)
        .json({ error: "Prompt is required and must be a string" });
      return;
    }

    try {
      // Get on-chain tools
      const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [
          sendETH(),
          erc20({ tokens: [USDC, PEPE] }),
          coingecko({
            apiKey: process.env.COINGECKO_API_KEY as string,
          }),
          // Add our token swap plugin
          tokenSwap(),
        ],
      });

      // Add information about which chain to use based on the isRootstock flag
      let systemMessage =
        "You are a personal assistant, quirky and fun. No text formatting, just keep it simple plain text. You have special abilities to check cryptocurrency prices and swap tokens.";

      if (isRootstock) {
        systemMessage +=
          " The user is asking about the Rootstock blockchain. When using the swap_tokens tool, you MUST set isRootstock: true in your function parameters. Available tokens on Rootstock are: RBTC (native token), DOC (Dollar on Chain), RIF (RSK Infrastructure Framework), SOV (Sovryn), BPRO (BitPRO), and RUSDT (Rootstock USDT). If the user asks to swap any of these tokens, you must use the swap_tokens tool with isRootstock set to true.";
      } else {
        systemMessage +=
          " The available tokens on Celo are: CELO (native token), cUSD (Celo Dollar), cEUR (Celo Euro), USDC, DAI, and USDT.";
      }

      // Add a note about Rootstock to the prompt if isRootstock is true
      let enhancedPrompt = prompt;
      if (isRootstock && !prompt.toLowerCase().includes("isrootstock")) {
        enhancedPrompt +=
          " When using swap_tokens, you MUST set isRootstock: true. The available Rootstock tokens are: RBTC, DOC, RIF, SOV, BPRO, RUSDT.";
      }

      // Generate response from the agent
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools,
        maxSteps: 10,
        prompt: enhancedPrompt,
        system: systemMessage,
        onStepFinish: (event) => {
          console.log("Tool Results:", event.toolResults);
        },
      });

      res.json({
        response: result.text,
        toolResults: result.steps?.map((step) => step.toolResults) || [],
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
