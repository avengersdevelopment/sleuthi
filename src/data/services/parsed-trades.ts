import type { TradeItem } from "@/data/services/trader-trades-seek-by-time";

import { isStablecoin } from "@/lib/trade-utils";

interface TradeItemDetail {
  symbol: string;
  address: string;
  token_amount: number;
  price_per_token_in_usd: number;
  position_size_in_usd: number;
}

interface TradeDirection {
  from: TradeItemDetail;
  to: TradeItemDetail;
}

export interface ParsedTradeItem {
  // tx_hash: string; // Commented out because: not needed for analysis
  block_unix_time: number;
  trade_type: "buy" | "sell";
  from: TradeDirection["from"];
  to: TradeDirection["to"];
  // checker_link: string; // Commented out because: possibly can be structured through prompt
}

export function getParsedTrades(trades: TradeItem[]): ParsedTradeItem[] {
  const parsedTrades = trades.map((trade) => {
    const tradeDirection = getTradeDirection(trade);

    // Determine trade type based on stablecoin direction
    const trade_type: "buy" | "sell" = isStablecoin(tradeDirection.from.address)
      ? "buy"
      : "sell";

    return {
      // original_trade: trade, // Original trade for debugging
      // tx_hash: trade.tx_hash, // Transaction hash for debugging
      block_unix_time: trade.block_unix_time,
      trade_type,
      ...tradeDirection,
      // checker_link: getCheckerLink(tradeDirection, walletAddress), // Checker link for debugging
    };
  });

  return parsedTrades;
}

// Helper function to determine trade direction
export function getTradeDirection(trade: TradeItem): TradeDirection {
  const [sourceToken, destinationToken] =
    trade.quote.type_swap === "from"
      ? [trade.quote, trade.base]
      : [trade.base, trade.quote];

  return {
    from: {
      symbol: sourceToken.symbol,
      address: sourceToken.address,
      token_amount: sourceToken.ui_amount,
      price_per_token_in_usd: sourceToken.price ?? sourceToken.nearest_price,
      position_size_in_usd:
        sourceToken.ui_amount *
        (sourceToken.price ?? sourceToken.nearest_price),
    },
    to: {
      symbol: destinationToken.symbol,
      address: destinationToken.address,
      token_amount: destinationToken.ui_amount,
      price_per_token_in_usd:
        destinationToken.price ?? destinationToken.nearest_price,
      position_size_in_usd:
        destinationToken.ui_amount *
        (destinationToken.price ?? destinationToken.nearest_price),
    },
  };
}
