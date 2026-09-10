import { GoogleFinanceMarketDataProvider } from "../src/providers/googleFinanceProvider.js";
import { YahooFinanceMarketDataProvider } from "../src/providers/yahooFinanceProvider.js";
import { MarketDataService } from "../src/services/marketDataService.js";

const yahooFinanceProvider =
  new YahooFinanceMarketDataProvider();

const googleFinanceProvider =
  new GoogleFinanceMarketDataProvider();

const marketDataService =
  new MarketDataService(
    yahooFinanceProvider,
    googleFinanceProvider,
  );

console.log("First request:");

const firstMarketData =
  await marketDataService.getMarketData(
    "HDFCBANK",
    "NSE",
  );

console.log(firstMarketData);

console.log("\nSecond request:");

const secondMarketData =
  await marketDataService.getMarketData(
    "HDFCBANK",
    "NSE",
  );

console.log(secondMarketData);

console.log(
  "\nSame cached object:",
  firstMarketData === secondMarketData,
);