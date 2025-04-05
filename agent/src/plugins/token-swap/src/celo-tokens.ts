/**
 * Dictionary of top tokens on Celo mainnet with their addresses
 */

export type CeloTokenName = "CELO" | "cUSD" | "cEUR" | "USDC" | "DAI";

export const CELO_TOKENS: Record<CeloTokenName, string> = {
  // Native CELO token
  CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438",

  // Celo Dollar stablecoin
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",

  // Celo Euro stablecoin
  cEUR: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",

  // USDC on Celo
  USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",

  // DAI on Celo
  DAI: "0xE4fE50cdD716522A56204352f00AA110F731932d",
};

/**
 * Function to get token address by name
 * @param tokenName The name of the token
 * @returns The address of the token or undefined if not found
 */
export function getTokenAddress(tokenName: string): string | undefined {
  const normalizedName = tokenName.toUpperCase() as CeloTokenName;
  return CELO_TOKENS[normalizedName] || undefined;
}

/**
 * Function to get token name by address
 * @param address The address of the token
 * @returns The name of the token or undefined if not found
 */
export function getTokenName(address: string): CeloTokenName | undefined {
  const normalizedAddress = address.toLowerCase();

  for (const [name, tokenAddress] of Object.entries(CELO_TOKENS)) {
    if (tokenAddress.toLowerCase() === normalizedAddress) {
      return name as CeloTokenName;
    }
  }

  return undefined;
}
