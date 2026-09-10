import type { MarketData } from "../types/market.js";

export interface GoogleFinanceProvider {
  getFundamentalData(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): Promise<
    Pick<
      MarketData,
      "priceToEarningsRatio" | "latestEarningsPerShare"
    >
  >;
}

interface GoogleFinanceFundamentalData {
  priceToEarningsRatio: number | null;
  latestEarningsPerShare: number | null;
}

export class GoogleFinanceMarketDataProvider
  implements GoogleFinanceProvider
{
  async getFundamentalData(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): Promise<GoogleFinanceFundamentalData> {
    const googleFinanceExchange =
      exchange === "NSE" ? "NSE" : "BOM";

    const googleFinanceUrl =
      `https://www.google.com/finance/quote/` +
      `${encodeURIComponent(marketSymbol)}:` +
      `${googleFinanceExchange}`;

    try {
      const response = await fetch(
        googleFinanceUrl,
        {
          signal: AbortSignal.timeout(5000),
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Google Finance request failed with status ${response.status}`,
        );
      }

      const html = await response.text();

      return parseGoogleFinanceFundamentalData(
        html,
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "TimeoutError"
      ) {
        throw new Error(
          `Google Finance request timed out for ${exchange} ${marketSymbol}`,
          {
            cause: error,
          },
        );
      }

      throw error;
    }
  }
}

function parseGoogleFinanceFundamentalData(
  html: string,
): GoogleFinanceFundamentalData {
  const priceToEarningsRatio =
    extractNumberAfterLabel(
      html,
      "P/E ratio",
    );

  const latestEarningsPerShare =
    extractNumberAfterLabel(
      html,
      "EPS",
    );

  return {
    priceToEarningsRatio,
    latestEarningsPerShare,
  };
}

function extractNumberAfterLabel(
  html: string,
  label: string,
): number | null {
  const escapedLabel =
    label.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  const pattern = new RegExp(
    `<div[^>]*class="SwQK7"[^>]*>` +
      `${escapedLabel}` +
      `</div>` +
      `<div[^>]*class="dO6ijd"[^>]*>` +
      `([^<]+)` +
      `</div>`,
    "i",
  );

  const match = html.match(pattern);

  if (match?.[1] === undefined) {
    return null;
  }

  const numericValue =
    Number.parseFloat(
      match[1]
        .replace(/[₹,$€£]/g, "")
        .replace(/,/g, "")
        .trim(),
    );

  return Number.isFinite(numericValue)
    ? numericValue
    : null;
}