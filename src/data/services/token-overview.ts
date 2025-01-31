import { env } from "@/env";
import { unstable_cache } from "next/cache";

export interface TokenOverviewData {
  address: string;
  symbol: string;
  name: string;
  price: number;
  mc: number;
  realMc: number;
  supply: number;
  circulatingSupply: number;
  decimals: number;
  vBuy1h: number;
  vBuy1hChangePercent: number;
  vSell1h: number;
  vSell1hChangePercent: number;
  holder: number;
  liquidity: number;
}

export interface TokenOverviewResponse {
  data: TokenOverviewData;
  success: boolean;
}

export const getTokenOverview = async (
  tokenAddress: string,
): Promise<TokenOverviewResponse> => {
  const response = await fetch(
    `https://public-api.birdeye.so/defi/token_overview?address=${tokenAddress}`,
    {
      headers: {
        accept: "application/json",
        "X-API-KEY": env.BIRDEYE_API_KEY,
        "x-chain": "solana",
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch token overview");
  }

  return data as TokenOverviewResponse;
};

export const getCachedTokenOverview = (tokenAddress: string) => {
  return unstable_cache(
    async () => {
      return getTokenOverview(tokenAddress);
    },
    ["birdeye", "token-overview", tokenAddress],
    {
      tags: ["birdeye", `birdeye_token-overview_${tokenAddress}`],
      revalidate: 15 * 60, // Cache for 15 minutes
    },
  )();
};
