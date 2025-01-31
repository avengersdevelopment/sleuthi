import { env } from "@/env";
import { unstable_cache } from "next/cache";

export interface PriceData {
  value: number;
  updateUnixTime: number;
  updateHumanTime: string;
  priceChange24h: number;
}

interface PriceResponse {
  success: boolean;
  data: PriceData;
}

export const getPrice = async (
  tokenAddress: string
): Promise<PriceResponse> => {
  const priceResponse = await fetch(
    `https://public-api.birdeye.so/defi/price?address=${tokenAddress}`,
    {
      headers: {
        accept: "application/json",
        "X-API-KEY": env.BIRDEYE_API_KEY,
        "x-chain": "solana",
      },
    },
  );

  if (!priceResponse.ok) {
    throw new Error("Failed to fetch price data");
  }

  return priceResponse.json();
};

export const getCachedPrice = (tokenAddress: string) => {
  return unstable_cache(
    async () => {
      return getPrice(tokenAddress);
    },
    ["birdeye", "price", tokenAddress],
    {
      tags: ["birdeye", `birdeye_price_${tokenAddress}`],
      revalidate: 15 * 60, // Cache for 15 minutes
    },
  )();
};
