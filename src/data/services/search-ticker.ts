import { env } from "@/env";
import { unstable_cache } from "next/cache";

// Updated interface to match Birdeye response
export interface SearchTickerData {
  name: string;
  symbol: string;
  address: string;
  fdv: number;
  liquidity: number;
  price: number;
  network: string;
  logo_uri: string;
}

interface SearchTickerResponse {
  data: {
    items: {
      type: string;
      result: SearchTickerData[];
    }[];
  };
}

export const searchTicker = async (ticker: string): Promise<string | null> => {
  const normalizedTicker = normalizeSymbol(ticker);

  const searchParams = new URLSearchParams({
    chain: "solana",
    keyword: normalizedTicker,
    target: "token",
    sort_by: "liquidity",
    sort_type: "desc",
    offset: "0",
    limit: "20",
  });

  const response = await fetch(
    `https://public-api.birdeye.so/defi/v3/search?${searchParams}`,
    {
      headers: {
        accept: "application/json",
        "X-API-KEY": env.BIRDEYE_API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search ticker data");
  }

  const searchData = (await response.json()) as SearchTickerResponse;

  // Find the first token item in the response
  const tokenItem = searchData.data.items.find((item) => item.type === "token");

  // Filter for matching symbols and sort by FDV
  const matchingTokens = tokenItem?.result
    .filter((token) => isSymbolMatch(normalizedTicker, token.symbol))
    .sort((a, b) => b.fdv - a.fdv); // Sort by FDV in descending order

  // Return the first matching token's address
  if (matchingTokens && matchingTokens.length > 0) {
    return matchingTokens[0].address;
  }

  return null;
};

export const getCachedSearchTicker = (ticker: string) => {
  const normalizedTicker = normalizeSymbol(ticker);
  return unstable_cache(
    async () => {
      return searchTicker(ticker);
    },
    ["birdeye", "search-ticker", normalizedTicker],
    {
      tags: ["birdeye", `birdeye_search-ticker_${normalizedTicker}`],
      revalidate: 30 * 24 * 60 * 60, // Cache for 30 days
    },
  )();
};

export const normalizeSymbol = (symbol: string): string => {
  // Remove $, spaces, and convert to uppercase
  return symbol.replace(/[$\s]/g, "").toUpperCase();
};

export const isSymbolMatch = (
  inputSymbol: string,
  resultSymbol: string,
): boolean => {
  const normalizedInput = normalizeSymbol(inputSymbol);
  const normalizedResult = normalizeSymbol(resultSymbol);
  return (
    normalizedResult.includes(normalizedInput) ||
    normalizedInput.includes(normalizedResult)
  );
};
