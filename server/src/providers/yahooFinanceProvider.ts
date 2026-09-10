import {
  resolveYahooFinanceSymbol,
} from "./yahooFinanceSymbolResolver.js";

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
      const response = await fetch(
        url,
        {
          signal: AbortSignal.timeout(5000),
        },
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