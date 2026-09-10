import { GoogleFinanceMarketDataProvider } from "../src/providers/googleFinanceProvider.js";

const googleFinanceProvider =
  new GoogleFinanceMarketDataProvider();

const fundamentalData =
  await googleFinanceProvider.getFundamentalData(
    "542651",
    "BSE",
  );

console.log(
  "KPIT Technologies (542651:BOM) fundamental data:",
  fundamentalData,
);