export interface CalculatedHoldingMetrics {
  investment: number;
  portfolioWeightPercentage: number;
  presentValue: number | null;
  gainOrLoss: number | null;
  gainOrLossPercentage: number | null;
}