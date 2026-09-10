import { CalculatedMetrics } from "./calculations";
import { MarketData } from "./market";
import { PortfolioHolding } from "./portfolio";

export interface PortfolioHoldingWithMarketData
  extends PortfolioHolding,
    MarketData,
    CalculatedMetrics {}