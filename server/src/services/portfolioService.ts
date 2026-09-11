import { MarketDataService } from "./marketDataService.js";
import type { PortfolioResponse } from "../types/portfolioResponse.js";
import { processWithConcurrency } from "../utils/processWithConcurrency.js";
import { PortfolioRepository } from "../repositories/portfolioRepository.js";
import {
  calculateHoldingMetrics,
} from "../utils/portfolioCalculations.js";

export class PortfolioService {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly marketDataService: MarketDataService,
  ) {}

  async getPortfolio(): Promise<PortfolioResponse> {
    const portfolioData =
      await this.portfolioRepository.getPortfolioData();

    const totalInvestment =
      portfolioData.currentHoldings.reduce(
        (total, holding) =>
          total +
          holding.purchasePrice * holding.quantity,
        0,
      );

    const marketDataResults =
      await processWithConcurrency(
        portfolioData.currentHoldings,
        2,
        (holding) =>
          this.marketDataService.getMarketData(
            holding.marketSymbol,
            holding.exchange,
          ),
      );

    const holdings =
      portfolioData.currentHoldings.map(
        (holding, index) => {
          const marketDataResult =
            marketDataResults[index];

          if (
            marketDataResult?.status ===
            "fulfilled"
          ) {
            const calculatedMetrics =
              calculateHoldingMetrics({
                purchasePrice:
                  holding.purchasePrice,
                quantity:
                  holding.quantity,
                currentMarketPrice:
                  marketDataResult.value
                    .currentMarketPrice,
                totalInvestment,
              });

            return {
              ...holding,
              ...marketDataResult.value,
              ...calculatedMetrics,
            };
          }

          console.error(
            `Market data failed for ${holding.stockName}:`,
            marketDataResult?.reason,
          );

          const calculatedMetrics =
            calculateHoldingMetrics({
              purchasePrice:
                holding.purchasePrice,
              quantity:
                holding.quantity,
              currentMarketPrice: null,
              totalInvestment,
            });

          return {
            ...holding,
            currentMarketPrice: null,
            priceToEarningsRatio: null,
            latestEarningsPerShare: null,
            dataStatus: "unavailable" as const,
            ...calculatedMetrics,
          };
        },
      );

    return {
      holdings,
      totalInvestment,
    };
  }
}