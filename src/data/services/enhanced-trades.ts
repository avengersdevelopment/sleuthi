import type { ParsedTradeItem } from "@/data/services/parsed-trades";

export interface EnhancedTradeItem {
  // Basic token info
  symbol: string;
  address: string;
  trades: ParsedTradeItem[]; // All trades for this token, for debugging

  // Current position status
  remaining_token_amount: number;
  external_transfer_token_amount: number;
  entry_time: number | null; // Unix timestamp of first buy
  exit_time: number | null; // Unix timestamp of last sell (or current time if not exited)

  // Trade status flags
  has_buy_and_sell: boolean; // true if we have both buy and sell transactions (not including external transfers or airdrops)
  has_external_transfer: boolean; // true if the trade of this token is airdropped or transferred from another wallet
  is_profitable: boolean | null; // true if the trade is profitable
  is_fully_exited: boolean; // true if we have sold the entire position
  total_pnl_in_usd: number; // total PnL in USD (might not accurately reflect the actual PnL if it's not fully exited and complete trades)
  hold_duration: number | null; // in seconds, track from the first buy to the last sell, if null (no data) indicate that the trade is not complete

  // Average prices
  avg_buy_price_per_token_in_usd: number;
  avg_sell_price_per_token_in_usd: number;

  // Total amounts and costs
  total_bought_token_amount: number;
  total_buy_cost_in_usd: number;
  total_sold_token_amount: number;
  total_sell_proceeds_in_usd: number;
}

export function getEnhancedTrades(parsedTrades: ParsedTradeItem[]) {
  // Group trades by token address
  const tradesByToken = parsedTrades.reduce(
    (acc, trade) => {
      const tokenAddress =
        trade.trade_type === "buy" ? trade.to.address : trade.from.address;
      const tokenSymbol =
        trade.trade_type === "buy" ? trade.to.symbol : trade.from.symbol;

      if (!acc[tokenAddress]) {
        acc[tokenAddress] = {
          symbol: tokenSymbol,
          address: tokenAddress,
          remaining_token_amount: 0,
          external_transfer_token_amount: 0,
          has_buy_and_sell: false,
          has_external_transfer: false,
          is_profitable: null,
          is_fully_exited: false,
          total_pnl_in_usd: 0,
          hold_duration: null,
          avg_buy_price_per_token_in_usd: 0,
          avg_sell_price_per_token_in_usd: 0,
          total_bought_token_amount: 0,
          total_buy_cost_in_usd: 0,
          total_sold_token_amount: 0,
          total_sell_proceeds_in_usd: 0,
          trades: [],
          entry_time: null,
          exit_time: null,
        };
      }

      acc[tokenAddress].trades.push(trade);

      // Sort trades by block_unix_time in ascending order
      acc[tokenAddress].trades.sort(
        (a: { block_unix_time: number }, b: { block_unix_time: number }) =>
          a.block_unix_time - b.block_unix_time,
      );

      // Check if there are any trades before accessing array elements
      const hasTrades = acc[tokenAddress].trades.length > 0;
      const firstTrade = hasTrades ? acc[tokenAddress].trades[0] : null;
      const hasSellTrades =
        hasTrades &&
        acc[tokenAddress].trades.some((t) => t.trade_type === "sell");

      // Update has_external_transfer flag if first trade is a sell
      acc[tokenAddress].has_external_transfer =
        hasTrades && firstTrade?.trade_type === "sell";

      // Update remaining token amount
      if (trade.trade_type === "buy") {
        acc[tokenAddress].remaining_token_amount += trade.to.token_amount;
      } else if (trade.trade_type === "sell") {
        acc[tokenAddress].remaining_token_amount -= trade.from.token_amount;
      }

      // Update PnL
      if (trade.trade_type === "buy") {
        // For buys, we subtract the cost (negative PnL)
        acc[tokenAddress].total_pnl_in_usd -= trade.from.position_size_in_usd;
      } else if (trade.trade_type === "sell") {
        // For sells, we add the proceeds (positive PnL)
        acc[tokenAddress].total_pnl_in_usd += trade.to.position_size_in_usd;
      }

      // Update is_profitable flag based on total PnL
      acc[tokenAddress].is_profitable = acc[tokenAddress].total_pnl_in_usd > 0;

      // Update has_buy_and_sell flag if we have first buy, last sell, and remaining token amount is less than 0
      acc[tokenAddress].has_buy_and_sell =
        hasTrades && firstTrade?.trade_type === "buy" && hasSellTrades;

      // Calculate hold duration if we have both buy and sell transactions
      if (hasTrades && firstTrade?.trade_type === "buy") {
        try {
          const firstBuy = acc[tokenAddress].trades.find(
            (t) => t?.trade_type === "buy",
          );
          const lastSell = [...acc[tokenAddress].trades]
            .reverse()
            .find((t) => t?.trade_type === "sell");

          if (firstBuy?.block_unix_time) {
            acc[tokenAddress].entry_time = firstBuy.block_unix_time;
          }

          // Set exit_time for any last sell, regardless of whether there was a buy
          if (lastSell?.block_unix_time) {
            acc[tokenAddress].exit_time = lastSell.block_unix_time;
            // Only calculate hold_duration if we have both buy and sell
            if (firstBuy?.block_unix_time) {
              acc[tokenAddress].hold_duration =
                lastSell.block_unix_time - firstBuy.block_unix_time;
            }
          } else {
            acc[tokenAddress].exit_time = null;
            if (firstBuy?.block_unix_time) {
              acc[tokenAddress].hold_duration =
                Math.floor(Date.now() / 1000) - firstBuy.block_unix_time;
            }
          }
        } catch (_error) {
          acc[tokenAddress].hold_duration = null;
          acc[tokenAddress].entry_time = null;
          acc[tokenAddress].exit_time = null;
        }
      } else if (hasTrades) {
        // Handle cases where first trade is not a buy
        const lastSell = [...acc[tokenAddress].trades]
          .reverse()
          .find((t) => t?.trade_type === "sell");
        if (lastSell?.block_unix_time) {
          acc[tokenAddress].exit_time = lastSell.block_unix_time;
        }
      }

      // Update is_fully_exited flag if remaining token amount is less than 0
      acc[tokenAddress].is_fully_exited =
        acc[tokenAddress].remaining_token_amount <= 0.000001;

      // Update buy/sell totals for average price calculations
      if (trade.trade_type === "buy") {
        acc[tokenAddress].total_bought_token_amount += trade.to.token_amount;
        acc[tokenAddress].total_buy_cost_in_usd +=
          trade.from.position_size_in_usd;
      } else if (trade.trade_type === "sell") {
        acc[tokenAddress].total_sold_token_amount += trade.from.token_amount;
        acc[tokenAddress].total_sell_proceeds_in_usd +=
          trade.to.position_size_in_usd;
      }

      // Calculate average prices
      acc[tokenAddress].avg_buy_price_per_token_in_usd =
        acc[tokenAddress].total_bought_token_amount > 0
          ? acc[tokenAddress].total_buy_cost_in_usd /
            acc[tokenAddress].total_bought_token_amount
          : 0;

      acc[tokenAddress].avg_sell_price_per_token_in_usd =
        acc[tokenAddress].total_sold_token_amount > 0
          ? acc[tokenAddress].total_sell_proceeds_in_usd /
            acc[tokenAddress].total_sold_token_amount
          : 0;

      return acc;
    },
    {} as Record<string, EnhancedTradeItem>,
  );

  // Normalisation
  for (const trade of Object.values(tradesByToken)) {
    if (trade.remaining_token_amount <= 0 && trade.has_buy_and_sell) {
      trade.remaining_token_amount = 0;
    }

    if (trade.remaining_token_amount <= 0 && trade.has_external_transfer) {
      trade.external_transfer_token_amount = Math.abs(
        trade.remaining_token_amount,
      );
      trade.remaining_token_amount = 0;
      trade.is_profitable = null;
      trade.total_pnl_in_usd = 0;
    }
  }

  // Convert the grouped trades object to an array
  const latestTrades = Object.values(tradesByToken);

  return latestTrades;
}
