export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainOrLoss: number;
  totalGainOrLossPercentage: number;
  totalPortfolioWeightPercentage: number;
  gainingHoldingCount: number;
  losingHoldingCount: number;
}