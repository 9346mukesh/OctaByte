export interface CalculatedMetrics {
  investment: number;
  portfolioWeightPercentage: number;
  presentValue: number | null;
  gainOrLoss: number | null;
  gainOrLossPercentage: number | null;
}