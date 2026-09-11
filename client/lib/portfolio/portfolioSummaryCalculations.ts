import type { PortfolioHolding } from "../../types/portfolio";

export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number | null;
  totalGainOrLoss: number | null;
  unavailableHoldingCount: number;
}

export function calculatePortfolioSummary(
  holdings: PortfolioHolding[],
): PortfolioSummary {
  const totalInvestment = holdings.reduce(
    (total, holding) => total + holding.investment,
    0,
  );

  const holdingsWithPresentValue = holdings.filter(
    (holding) => holding.presentValue !== null,
  );

  const holdingsWithGainOrLoss = holdings.filter(
    (holding) => holding.gainOrLoss !== null,
  );

  const totalPresentValue =
    holdingsWithPresentValue.length === 0
      ? null
      : holdingsWithPresentValue.reduce(
          (total, holding) =>
            total + (holding.presentValue ?? 0),
          0,
        );

  const totalGainOrLoss =
    holdingsWithGainOrLoss.length === 0
      ? null
      : holdingsWithGainOrLoss.reduce(
          (total, holding) =>
            total + (holding.gainOrLoss ?? 0),
          0,
        );

  const unavailableHoldingCount = holdings.filter(
    (holding) => holding.dataStatus === "unavailable",
  ).length;

  return {
    totalInvestment,
    totalPresentValue,
    totalGainOrLoss,
    unavailableHoldingCount,
  };
}