import {
  YahooFinanceMarketDataProvider,
} from "../src/providers/yahooFinanceProvider.js";

const yahooFinanceProvider =
  new YahooFinanceMarketDataProvider();

const testHoldings = [
  {
    stockName: "HDFC Bank",
    marketSymbol: "HDFCBANK",
    exchange: "NSE" as const,
  },
  {
    stockName: "ICICI Bank",
    marketSymbol: "532174",
    exchange: "BSE" as const,
  },
  {
    stockName: "Bajaj Housing",
    marketSymbol: "544252",
    exchange: "BSE" as const,
  },
  {
    stockName: "Savani Financials",
    marketSymbol: "511577",
    exchange: "BSE" as const,
  },
];

for (const holding of testHoldings) {
  try {
    const currentMarketPrice =
      await yahooFinanceProvider.getCurrentMarketPrice(
        holding.marketSymbol,
        holding.exchange,
      );

    console.log({
      stockName: holding.stockName,
      currentMarketPrice,
    });
  } catch (error) {
    console.error({
      stockName: holding.stockName,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}