import { env } from "@/env";
import { unstable_cache } from "next/cache";

interface TokenInfo {
  symbol: string;
  decimals: number;
  address: string;
  amount: number;
  type: string;
  type_swap: string;
  ui_amount: number;
  price: number | null;
  nearest_price: number;
  change_amount: number;
  ui_change_amount: number;
  fee_info?: unknown;
}

export interface TradeItem {
  quote: TokenInfo;
  base: TokenInfo;
  base_price: number | null;
  quote_price: number | null;
  tx_hash: string;
  source: string;
  block_unix_time: number;
  tx_type: string;
  address: string;
  owner: string;
}

interface TraderTradesResponse {
  success: boolean;
  data: {
    items: TradeItem[];
    has_next: boolean;
  };
}

export const getTraderTrades = async (
  address: string,
  options?: {
    offset?: number;
    limit?: number;
    txType?: string;
    sortType?: "desc" | "asc";
    beforeTime?: number;
    afterTime?: number;
  },
): Promise<TraderTradesResponse> => {
  const {
    offset = 0,
    limit = 100,
    txType = "all",
    sortType = "desc",
    beforeTime = 0,
    afterTime = 0,
  } = options || {};

  const queryParams = new URLSearchParams({
    address,
    offset: offset.toString(),
    limit: limit.toString(),
    tx_type: txType,
    sort_type: sortType,
    ...(beforeTime && { before_time: beforeTime.toString() }),
    ...(afterTime && { after_time: afterTime.toString() }),
  });

  const response = await fetch(
    `https://public-api.birdeye.so/trader/txs/seek_by_time?${queryParams}`,
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
    throw new Error("Failed to fetch trader trades");
  }

  // Manually sort the trades by block time to ensure the sorting is working
  if (sortType === "desc") {
    data.data.items.sort((a: TradeItem, b: TradeItem) => {
      return b.block_unix_time - a.block_unix_time;
    });
  } else {
    data.data.items.sort((a: TradeItem, b: TradeItem) => {
      return a.block_unix_time - b.block_unix_time;
    });
  }

  return data as TraderTradesResponse;
};

export const getCachedTraderTrades = (
  address: string,
  options?: Parameters<typeof getTraderTrades>[1],
) => {
  return unstable_cache(
    async () => {
      return getTraderTrades(address, options);
    },
    ["birdeye", "trader-trades", address, JSON.stringify(options)],
    {
      tags: ["birdeye", `birdeye_trader-trades_${address}`],
      revalidate: 12 * 60 * 60, // Cache for 12 hours
    },
  )();
};
