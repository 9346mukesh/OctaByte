import type { GoogleFinanceProvider } from "../providers/googleFinanceProvider.js";
import type { YahooFinanceProvider } from "../providers/yahooFinanceProvider.js";
import type { MarketData } from "../types/market.js";

interface CachedMarketPrice {
  currentMarketPrice: number;
  cachedAt: number;
}

interface CachedFundamentalData {
  priceToEarningsRatio: number | null;
  latestEarningsPerShare: number | null;
  cachedAt: number;
}

export class MarketDataService {
  private readonly currentMarketPriceCache = new Map<
    string,
    CachedMarketPrice
  >();

  private readonly fundamentalDataCache = new Map<
    string,
    CachedFundamentalData
  >();

  private readonly currentMarketPriceCacheDurationMilliseconds =
    15_000;

  private readonly fundamentalDataCacheDurationMilliseconds =
    2 * 60_000;

  private readonly loggedProviderFailures =
    new Set<string>();

  constructor(
    private readonly yahooFinanceProvider: YahooFinanceProvider,
    private readonly googleFinanceProvider: GoogleFinanceProvider,
  ) {}

  async getMarketData(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): Promise<MarketData> {
    const [
      currentMarketPriceResult,
      fundamentalDataResult,
    ] = await Promise.allSettled([
      this.getCurrentMarketPriceWithCache(
        marketSymbol,
        exchange,
      ),
      this.getFundamentalDataWithCache(
        marketSymbol,
        exchange,
      ),
    ]);

    if (
      currentMarketPriceResult.status ===
      "rejected"
    ) {
      this.logProviderFailure(
        "Yahoo Finance",
        marketSymbol,
        exchange,
        currentMarketPriceResult.reason,
      );
    }

    if (
      fundamentalDataResult.status ===
      "rejected"
    ) {
      this.logProviderFailure(
        "Google Finance",
        marketSymbol,
        exchange,
        fundamentalDataResult.reason,
      );
    }

    const currentMarketPrice =
      currentMarketPriceResult.status === "fulfilled"
        ? currentMarketPriceResult.value
        : null;

    const fundamentalData =
      fundamentalDataResult.status === "fulfilled"
        ? fundamentalDataResult.value
        : {
            priceToEarningsRatio: null,
            latestEarningsPerShare: null,
          };

    return {
      currentMarketPrice,
      priceToEarningsRatio:
        fundamentalData.priceToEarningsRatio,
      latestEarningsPerShare:
        fundamentalData.latestEarningsPerShare,
      dataStatus:
        currentMarketPrice === null
          ? "unavailable"
          : "available",
    };
  }

  private logProviderFailure(
    providerName: string,
    marketSymbol: string,
    exchange: "NSE" | "BSE",
    reason: unknown,
  ): void {
    const failureKey =
      `${providerName}:${exchange}:${marketSymbol}`;

    if (this.loggedProviderFailures.has(failureKey)) {
      return;
    }

    this.loggedProviderFailures.add(failureKey);

    const message =
      reason instanceof Error
        ? reason.message
        : String(reason);

    console.warn(
      `${providerName} unavailable for ${exchange} ${marketSymbol}: ${message}`,
    );
  }

  private async getCurrentMarketPriceWithCache(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): Promise<number> {
    const cacheKey =
      this.createCacheKey(
        marketSymbol,
        exchange,
      );

    const cachedMarketPrice =
      this.currentMarketPriceCache.get(cacheKey);

    if (cachedMarketPrice !== undefined) {
      const cacheAge =
        Date.now() - cachedMarketPrice.cachedAt;

      if (
        cacheAge <
        this.currentMarketPriceCacheDurationMilliseconds
      ) {
        return cachedMarketPrice.currentMarketPrice;
      }

      this.currentMarketPriceCache.delete(
        cacheKey,
      );
    }

    const currentMarketPrice =
      await this.yahooFinanceProvider.getCurrentMarketPrice(
        marketSymbol,
        exchange,
      );

    this.currentMarketPriceCache.set(
      cacheKey,
      {
        currentMarketPrice,
        cachedAt: Date.now(),
      },
    );

    this.loggedProviderFailures.delete(
      `Yahoo Finance:${exchange}:${marketSymbol}`,
    );

    return currentMarketPrice;
  }

  private async getFundamentalDataWithCache(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): Promise<
    Pick<
      MarketData,
      "priceToEarningsRatio" | "latestEarningsPerShare"
    >
  > {
    const cacheKey =
      this.createCacheKey(
        marketSymbol,
        exchange,
      );

    const cachedFundamentalData =
      this.fundamentalDataCache.get(cacheKey);

    if (cachedFundamentalData !== undefined) {
      const cacheAge =
        Date.now() - cachedFundamentalData.cachedAt;

      if (
        cacheAge <
        this.fundamentalDataCacheDurationMilliseconds
      ) {
        return {
          priceToEarningsRatio:
            cachedFundamentalData.priceToEarningsRatio,
          latestEarningsPerShare:
            cachedFundamentalData.latestEarningsPerShare,
        };
      }

      this.fundamentalDataCache.delete(
        cacheKey,
      );
    }

    const fundamentalData =
      await this.googleFinanceProvider.getFundamentalData(
        marketSymbol,
        exchange,
      );

    this.fundamentalDataCache.set(
      cacheKey,
      {
        ...fundamentalData,
        cachedAt: Date.now(),
      },
    );

    this.loggedProviderFailures.delete(
      `Google Finance:${exchange}:${marketSymbol}`,
    );

    return fundamentalData;
  }

  private createCacheKey(
    marketSymbol: string,
    exchange: "NSE" | "BSE",
  ): string {
    return `${exchange}:${marketSymbol}`;
  }
}