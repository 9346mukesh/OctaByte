import { PortfolioHoldingWithMarketData } from "./holding";

export interface SectorSummary {
  sector: string;
  holdings: PortfolioHoldingWithMarketData[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainOrLoss: number;
}