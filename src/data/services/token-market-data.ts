import { env } from "@/env";
import { unstable_cache } from "next/cache";

export interface TokenMarketData {
  address: string;
  liquidity: number;
  price: number;
  supply: number;
  marketcap: number;
  circulating_supply: number;
  circulating_marketcap: number;
}

interface TokenMarketDataResponse {
  success: boolean;
  data: TokenMarketData;
}

export const getTokenMarketData = async (
  tokenAddress: string,
): Promise<TokenMarketDataResponse> => {
  const tokenMarketDataResponse = await fetch(
    `https://public-api.birdeye.so/defi/v3/token/market-data?address=${tokenAddress}`,
    {
      headers: {
        accept: "application/json",
        "X-API-KEY": env.BIRDEYE_API_KEY,
        "x-chain": "solana",
      },
    },
  );

  if (!tokenMarketDataResponse.ok) {
    console.error({ tokenMarketDataResponse });
    throw new Error("Failed to fetch token market data");
  }

  return tokenMarketDataResponse.json();
};

export const getCachedTokenMarketData = (tokenAddress: string) => {
  return unstable_cache(
    async () => {
      return getTokenMarketData(tokenAddress);
    },
    ["birdeye", "token-market-data", tokenAddress],
    {
      tags: ["birdeye", `birdeye_token-market-data_${tokenAddress}`],
      revalidate: 15 * 60, // Cache for 15 minutes
    },
  )();
};
