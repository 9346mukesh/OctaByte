export interface MarketData {
  currentMarketPrice: number | null;
  priceToEarningsRatio: number | null;
  latestEarningsPerShare: number | null;
  dataStatus: "available" | "unavailable";
}