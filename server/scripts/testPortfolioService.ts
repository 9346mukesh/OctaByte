import { GoogleFinanceMarketDataProvider } from "../src/providers/googleFinanceProvider.js";
import { YahooFinanceMarketDataProvider } from "../src/providers/yahooFinanceProvider.js";
import { PortfolioRepository } from "../src/repositories/portfolioRepository.js";
import { MarketDataService } from "../src/services/marketDataService.js";
import { PortfolioService } from "../src/services/portfolioService.js";

const portfolioRepository =
  new PortfolioRepository();

const yahooFinanceProvider =
  new YahooFinanceMarketDataProvider();

const googleFinanceProvider =
  new GoogleFinanceMarketDataProvider();

const marketDataService =
  new MarketDataService(
    yahooFinanceProvider,
    googleFinanceProvider,
  );

const portfolioService =
  new PortfolioService(
    portfolioRepository,
    marketDataService,
  );

const portfolio =
  await portfolioService.getPortfolio();

console.log(
  "Total holdings:",
  portfolio.holdings.length,
);

console.log(
  "Total investment:",
  portfolio.totalInvestment,
);

console.log("\nHoldings:");

for (const holding of portfolio.holdings) {
  console.log({
    stockName: holding.stockName,
    marketSymbol: holding.marketSymbol,
    exchange: holding.exchange,
    currentMarketPrice:
      holding.currentMarketPrice,
    priceToEarningsRatio:
      holding.priceToEarningsRatio,
    latestEarningsPerShare:
      holding.latestEarningsPerShare,
    investment: holding.investment,
    presentValue: holding.presentValue,
    gainOrLoss: holding.gainOrLoss,
    gainOrLossPercentage:
      holding.gainOrLossPercentage,
    portfolioWeightPercentage:
      holding.portfolioWeightPercentage,
    dataStatus: holding.dataStatus,
  });
}