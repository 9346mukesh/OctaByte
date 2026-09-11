import type { MarketData } from "./market.js";
import type { NormalizedHoldingData } from "./portfolio.js";
import type { CalculatedHoldingMetrics } from "./calculations.js";

export interface PortfolioHolding
  extends NormalizedHoldingData,
    MarketData,
    CalculatedHoldingMetrics {}

export interface PortfolioResponse {
  holdings: PortfolioHolding[];
  totalInvestment: number;
}