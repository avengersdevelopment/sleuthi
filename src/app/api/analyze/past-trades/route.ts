import {
  type EnhancedTradeItem,
  getEnhancedTrades,
} from "@/data/services/enhanced-trades";
import {
  type OhlcvDuration,
  type OhlcvItem,
  getCachedOhlcvData,
} from "@/data/services/ohlcv";
import { getParsedTrades } from "@/data/services/parsed-trades";
import { type PriceData, getCachedPrice } from "@/data/services/price";
import {
  type TokenMarketData,
  getCachedTokenMarketData,
} from "@/data/services/token-market-data";
import { getCachedTraderTrades } from "@/data/services/trader-trades-seek-by-time";
import { WalletAddressRequestSchema } from "@/data/schemas/dto";
import { getCheckerLink, isExcludedToken } from "@/lib/trade-utils";
import { formatZodError } from "@/lib/utils";

export interface PastTradeItem extends EnhancedTradeItem {
  // Market cap analysis
  market_cap_at_the_time_of_entry: number;
  market_cap_at_the_time_of_exit: number;
  ath_market_cap_during_hold: number;
  ath_market_cap_after_sell: number;
  current_market_cap: number;

  // Price analysis
  current_price_per_token_in_usd: number;
  ath_price_during_hold_in_usd: number;
  ath_price_during_hold_timestamp: number;
  ath_price_after_sell_in_usd: number;
  ath_price_after_sell_timestamp: number;
  current_ethereum_price_in_usd: number;

  // External links
  checker_link: string;
}

export async function POST(request: Request) {
  const body = await request.json();

  const result = WalletAddressRequestSchema.safeParse(body);

  if (!result.success) {
    return Response.json(formatZodError(result.error), { status: 400 });
  }

  const { walletAddress } = result.data;

  const trades = await getCachedTraderTrades(walletAddress, {
    limit: 100,
    sortType: "desc",
  });

  const parsedTrades = getParsedTrades(trades.data.items);

  const enhancedTrades = getEnhancedTrades(parsedTrades)
    .filter((trade) => !isExcludedToken(trade.symbol))
    .slice(0, 5); // Rekt 5 trades

  // Get unique token addresses to minimize API calls
  const uniqueTokenAddresses = Array.from(
    new Set(enhancedTrades.map((trade) => trade.address)),
  );

  // Fetch data for unique tokens only
  const tokenDataMap = new Map<
    string,
    {
      marketData: TokenMarketData;
      currentPrice: PriceData;
      ohlcvData: OhlcvItem[];
    }
  >();

  // Batch fetch all token data
  const tokenDataPromises = uniqueTokenAddresses.map(async (tokenAddress) => {
    const relevantTrade = enhancedTrades.find(
      (t) => t.address === tokenAddress,
    );
    const entryTime = relevantTrade?.entry_time ?? 0;
    const exitTime = relevantTrade?.exit_time ?? 0;
    const currentTime = Math.floor(Date.now() / 1000);

    let ohlcvDataTimeFrame: OhlcvDuration = "1D";
    if (entryTime > 0 && exitTime > 0) {
      const diffInDays = Math.floor((exitTime - entryTime) / 86400);
      const diffInHours = Math.floor((exitTime - entryTime) / 3600);

      if (diffInHours <= 24) {
        ohlcvDataTimeFrame = "15m";
      } else if (diffInHours <= 72) {
        ohlcvDataTimeFrame = "1H";
      } else if (diffInDays > 30) {
        ohlcvDataTimeFrame = "1W";
      }
    }

    const [marketData, currentPrice, ohlcvData] = await Promise.all([
      getCachedTokenMarketData(tokenAddress),
      getCachedPrice(tokenAddress),
      getCachedOhlcvData(
        tokenAddress,
        entryTime,
        currentTime,
        ohlcvDataTimeFrame as OhlcvDuration,
      ),
    ]);

    tokenDataMap.set(tokenAddress, {
      marketData: marketData.data,
      currentPrice: currentPrice.data,
      ohlcvData: ohlcvData.data.items,
    });
  });

  // Wait for all token data to be fetched
  await Promise.all(tokenDataPromises);

  const SOLANA_ADDRESS = "So11111111111111111111111111111111111111112";

  const refPrice = await getCachedPrice(SOLANA_ADDRESS);

  // Process trades using the cached token data
  const pastTrades = enhancedTrades.map((trade) => {
    const tokenData = tokenDataMap.get(trade.address);
    const { marketData, currentPrice, ohlcvData } = tokenData ?? {};

    if (!marketData || !currentPrice || !ohlcvData) {
      return trade;
    }

    const marketCapAtEntry =
      trade.avg_buy_price_per_token_in_usd * marketData.circulating_supply;
    const marketCapAtExit =
      trade.avg_sell_price_per_token_in_usd * marketData.circulating_supply;

    const getReliablePrice = (item: OhlcvItem, wickThreshold = 2) => {
      // If high price is more than threshold times the closing price,
      // consider it a wick and use the minimum
      if (item.h > item.c * wickThreshold) {
        return Math.min(item.h, item.c);
      }
      return item.h;
    };

    const findPriceWithTimestamp = (
      items: OhlcvItem[],
      filterFn: (item: OhlcvItem) => boolean,
    ) => {
      return items.filter(filterFn).reduce(
        (acc, item) => {
          const price = getReliablePrice(item);
          return price > acc.price ? { price, timestamp: item.unixTime } : acc;
        },
        { price: 0, timestamp: 0 },
      );
    };

    const athDuringHold = findPriceWithTimestamp(
      ohlcvData,
      (item) =>
        item.unixTime <= (trade.exit_time ?? 0) &&
        item.unixTime >= (trade.entry_time ?? 0),
    );

    const athAfterSell = findPriceWithTimestamp(
      ohlcvData,
      (item) => item.unixTime > (trade.exit_time ?? 0),
    );

    return {
      ...Object.fromEntries(
        Object.entries(trade).filter(([key]) => key !== "trades"),
      ),
      market_cap_at_the_time_of_entry: marketCapAtEntry,
      market_cap_at_the_time_of_exit: marketCapAtExit,
      ath_market_cap_during_hold: athDuringHold.price * marketData.supply,
      ath_market_cap_after_sell: athAfterSell.price * marketData.supply,
      current_market_cap: marketData.marketcap,
      current_price_per_token_in_usd: currentPrice.value,
      ath_price_during_hold_in_usd: athDuringHold.price,
      ath_price_during_hold_timestamp: athDuringHold.timestamp,
      ath_price_after_sell_in_usd: athAfterSell.price,
      ath_price_after_sell_timestamp: athAfterSell.timestamp,
      current_ethereum_price_in_usd: refPrice.data.value,
      checker_link: getCheckerLink(trade.address, walletAddress, "solana"),
      trades: trade.trades,
    };
  }) as PastTradeItem[];

  return Response.json({
    total_pnl_in_usd: pastTrades.reduce(
      (acc, trade) => acc + trade.total_pnl_in_usd,
      0,
    ),
    past_trades: pastTrades as PastTradeItem[],
  });
}
