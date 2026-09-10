import { PortfolioHoldingWithMarketData } from "./holding";
import { SectorSummary } from "./sector";
import { PortfolioSummary } from "./summary";

export interface PortfolioDashboard {
  holdings: PortfolioHoldingWithMarketData[];
  sectorSummaries: SectorSummary[];
  portfolioSummary: PortfolioSummary;
  lastUpdated: string;
}