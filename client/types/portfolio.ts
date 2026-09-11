export interface PortfolioHolding {
  id: string;
  stockName: string;
  marketSymbol: string;
  sector: string | null;
  exchange: "NSE" | "BSE";

  purchasePrice: number;
  quantity: number;

  currentMarketPrice: number | null;
  priceToEarningsRatio: number | null;
  latestEarningsPerShare: number | null;

  dataStatus: "available" | "unavailable";

  investment: number;
  portfolioWeightPercentage: number;

  presentValue: number | null;
  gainOrLoss: number | null;
  gainOrLossPercentage: number | null;
}

export interface PortfolioData {
  holdings: PortfolioHolding[];
  totalInvestment: number;
}

export interface PortfolioApiResponse {
  success: boolean;
  data: PortfolioData;
}