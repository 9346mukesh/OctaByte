import {
  GoogleFinanceMarketDataProvider,
} from "../src/providers/googleFinanceProvider.js";

const googleFinanceProvider =
  new GoogleFinanceMarketDataProvider();

const fundamentalData =
  await googleFinanceProvider.getFundamentalData(
    "HDFCBANK",
    "NSE",
  );

console.log("HDFC Bank fundamental data:");
console.log(fundamentalData);