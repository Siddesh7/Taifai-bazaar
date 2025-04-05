import express, { Request, Response, Router } from "express";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { coingecko } from "@goat-sdk/plugin-coingecko";
import { oneInch } from "@goat-sdk/plugin-1inch";
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
  transport: http(process.env.RPC_PROVIDER_URL),
  chain: baseSepolia,
});

interface AgentRequestBody {
  prompt: string;
}

// Agent route
router.post(
  "/message",
  async (
    req: Request<{}, any, AgentRequestBody>,
    res: Response
  ): Promise<void> => {
    const { prompt } = req.body;

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
          oneInch({
            apiKey: process.env.ONEINCH_API_KEY as string, // Get it from: https://portal.1inch.dev
          }),
        ],
      });

      // Generate response from the agent
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools,
        maxSteps: 10,
        prompt,
        system:
          "You are a personal assistant, quirky and fun. No text formatting, just keep it simple plain text",
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
