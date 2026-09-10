import type { CalculatedHoldingMetrics } from "../types/calculations.js";

export interface HoldingCalculationInput {
  purchasePrice: number;
  quantity: number;
  currentMarketPrice: number | null;
  totalInvestment: number;
}

export function calculateHoldingMetrics(
  input: HoldingCalculationInput,
): CalculatedHoldingMetrics {
  const investment =
    input.purchasePrice * input.quantity;

  const portfolioWeightPercentage =
    input.totalInvestment === 0
      ? 0
      : (investment / input.totalInvestment) * 100;

  if (input.currentMarketPrice === null) {
    return {
      investment,
      portfolioWeightPercentage,
      presentValue: null,
      gainOrLoss: null,
      gainOrLossPercentage: null,
    };
  }

  const presentValue =
    input.currentMarketPrice * input.quantity;

  const gainOrLoss =
    presentValue - investment;

  const gainOrLossPercentage =
    investment === 0
      ? 0
      : (gainOrLoss / investment) * 100;

  return {
    investment,
    portfolioWeightPercentage,
    presentValue,
    gainOrLoss,
    gainOrLossPercentage,
  };
}