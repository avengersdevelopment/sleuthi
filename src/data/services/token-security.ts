import { env } from "@/env";
import { unstable_cache } from "next/cache";

export interface TokenSecurityData {
  antiWhaleModifiable: string;
  buyTax: string;
  canTakeBackOwnership: string;
  cannotBuy: string;
  cannotSellAll: string;
  creatorAddress: string;
  creatorBalance: string;
  creatorPercentage: string;
  hiddenOwner: string;
  holderCount: string;
  isHoneypot: string;
  isOpenSource: string;
  isProxy: string;
  isAntiWhale: string;
  isMintable: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  tradingCooldown: string;
  transferPausable: string;
  lpHolderCount: string;
  lpTotalSupply: string;
  lpHolders?: Array<{
    address: string;
    percent: string;
    balance: string;
    is_locked: number;
  }>;
}

export interface TokenSecurityResponse {
  data: TokenSecurityData;
  success: boolean;
  statusCode: number;
}

export const getTokenSecurity = async (
  tokenAddress: string,
): Promise<TokenSecurityResponse> => {
  const response = await fetch(
    `https://public-api.birdeye.so/defi/token_security?address=${tokenAddress}`,
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
    console.error(
      `Error fetching token security: ${response.status} ${response.statusText}`,
    );
    console.error(`Response body: ${JSON.stringify(data)}`);
    throw new Error("Failed to fetch token security");
  }

  return data as TokenSecurityResponse;
};

export const getCachedTokenSecurity = (tokenAddress: string) => {
  return unstable_cache(
    async () => {
      return getTokenSecurity(tokenAddress);
    },
    ["birdeye", "token-security", tokenAddress],
    {
      tags: ["birdeye", `birdeye_token-security_${tokenAddress}`],
      revalidate: 15 * 60, // Cache for 15 minutes
    },
  )();
};
