import {
  resolveYahooFinanceSymbol,
} from "./yahooFinanceSymbolResolver.js";
import { RequestThrottle } from "../utils/requestThrottle.js";

export interface YahooFinanceProvider {
  getCurrentMarketPrice(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): Promise<number>;
}

interface YahooFinanceChartResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice?: number;
      };
    }> | null;
    error: unknown;
  };
}

const yahooFinanceRequestTimeoutMilliseconds =
  Number(process.env.MARKET_DATA_REQUEST_TIMEOUT_MS) ||
  10_000;

const yahooFinanceRequestThrottle =
  new RequestThrottle(
    Number(
      process.env.MARKET_DATA_MIN_REQUEST_INTERVAL_MS,
    ) || 250,
  );

export class YahooFinanceMarketDataProvider
  implements YahooFinanceProvider
{
  async getCurrentMarketPrice(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): Promise<number> {
    const yahooFinanceSymbol =
      resolveYahooFinanceSymbol(
        marketSymbol,
        exchange,
      );

    if (yahooFinanceSymbol === null) {
      throw new Error(
        `Yahoo Finance symbol is unavailable for ${exchange} ${marketSymbol}`,
      );
    }

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/` +
      `${encodeURIComponent(yahooFinanceSymbol)}`;

    try {
      const response = await yahooFinanceRequestThrottle.run(
        () => fetch(
          url,
          {
            signal: AbortSignal.timeout(
              yahooFinanceRequestTimeoutMilliseconds,
            ),
          },
        ),
      );

      if (!response.ok) {
        throw new Error(
          `Yahoo Finance request failed with status ${response.status}`,
        );
      }

      const data =
        (await response.json()) as YahooFinanceChartResponse;

      const currentMarketPrice =
        data.chart.result?.[0]?.meta
          .regularMarketPrice;

      if (
        typeof currentMarketPrice !== "number" ||
        !Number.isFinite(currentMarketPrice)
      ) {
        throw new Error(
          `Current market price is unavailable for ${exchange} ${marketSymbol}`,
        );
      }

      return currentMarketPrice;
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "TimeoutError"
      ) {
        throw new Error(
          `Yahoo Finance request timed out for ${exchange} ${marketSymbol}`,
          {
            cause: error,
          },
        );
      }

      throw error;
    }
  }
}