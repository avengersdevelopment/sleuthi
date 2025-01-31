import { env } from "@/env";
import { unstable_cache } from "next/cache";

export interface OhlcvItem {
  address: string;
  o: number; // Open price
  h: number; // High price
  l: number; // Low price
  c: number; // Close price
  v: number; // Volume
  type: string;
  unixTime: number;
}

interface OhlcvResponse {
  data: {
    items: OhlcvItem[];
  };
}

export type OhlcvDuration = "15m" | "1H" | "4H" | "12H" | "1D" | "1W";

export const getOhlcvData = async (
  tokenAddress: string,
  timeFrom: number,
  timeTo: number,
  duration: OhlcvDuration = "1H", // Default to 1H for better precision
): Promise<OhlcvResponse> => {
  const ohlcvResponse = await fetch(
    `https://public-api.birdeye.so/defi/ohlcv?address=${tokenAddress}&type=${duration}&time_from=${timeFrom}&time_to=${timeTo}`,
    {
      headers: {
        accept: "application/json",
        "X-API-KEY": env.BIRDEYE_API_KEY as string,
        "x-chain": "solana",
      },
    },
  );

  const ohlcvData = await ohlcvResponse.json();

  if (!ohlcvResponse.ok) {
    throw new Error("Failed to fetch OHLCV data");
  }

  return ohlcvData as OhlcvResponse;
};

export const getCachedOhlcvData = (
  tokenAddress: string,
  timeFrom: number,
  timeTo: number,
  duration: OhlcvDuration = "1H",
) => {
  return unstable_cache(
    async () => {
      return getOhlcvData(tokenAddress, timeFrom, timeTo, duration);
    },
    [
      "birdeye",
      "ohlcv",
      tokenAddress,
      timeFrom.toString(),
      timeTo.toString(),
      duration,
    ],
    {
      tags: [
        "birdeye",
        `birdeye_ohlcv_${tokenAddress}_${timeFrom}_${timeTo}_${duration}`,
      ],
      revalidate: 15 * 60, // Cache for 15 minutes
    },
  )();
};
