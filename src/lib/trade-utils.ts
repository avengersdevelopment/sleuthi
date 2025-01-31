const STABLECOIN_ADDRESSES_SOL = {
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  SOL: "So11111111111111111111111111111111111111112",
};

// Helper function to check if token is a stablecoin
export function isStablecoin(address: string): boolean {
  return Object.values(STABLECOIN_ADDRESSES_SOL).includes(address);
}

// Helper function to get the checker link
export function getCheckerLink(address: string, walletAddress: string, chain: string) {
  return `https://dexscreener.com/${chain}/${address}?maker=${walletAddress}`;
}

export const EXCLUDED_TOKENS = [
  "USDC",
  "USDT",
  "USDE",
  "SOL",
  "WSOL",
  "ETH",
  "WETH",
  "BTC",
  "WBTC",
  "WSTETH",
  "STETH",
] as const;

export const isExcludedToken = (symbol: string): boolean => {
  return EXCLUDED_TOKENS.some(
    (token) => symbol.toUpperCase() === token.toUpperCase(),
  );
};
