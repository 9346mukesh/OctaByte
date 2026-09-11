import type { PortfolioHolding } from "../../types/portfolio";

export interface SectorPortfolioGroup {
  sector: string;
  holdings: PortfolioHolding[];
  totalInvestment: number;
  totalPresentValue: number | null;
  totalGainOrLoss: number | null;
}

export function groupHoldingsBySector(
  holdings: PortfolioHolding[],
): SectorPortfolioGroup[] {
  const sectorGroups = new Map<
    string,
    PortfolioHolding[]
  >();

  for (const holding of holdings) {
    const sectorName =
      holding.sector ?? "Other";

    const existingHoldings =
      sectorGroups.get(sectorName) ?? [];

    existingHoldings.push(holding);

    sectorGroups.set(
      sectorName,
      existingHoldings,
    );
  }

  return Array.from(
    sectorGroups,
    ([sector, sectorHoldings]) => {
      const totalInvestment =
        sectorHoldings.reduce(
          (total, holding) =>
            total + holding.investment,
          0,
        );

      const hasUnavailablePresentValue =
        sectorHoldings.some(
          (holding) =>
            holding.presentValue === null,
        );

      const hasUnavailableGainOrLoss =
        sectorHoldings.some(
          (holding) =>
            holding.gainOrLoss === null,
        );

      const totalPresentValue =
        hasUnavailablePresentValue
          ? null
          : sectorHoldings.reduce(
              (total, holding) =>
                total +
                (holding.presentValue ?? 0),
              0,
            );

      const totalGainOrLoss =
        hasUnavailableGainOrLoss
          ? null
          : sectorHoldings.reduce(
              (total, holding) =>
                total +
                (holding.gainOrLoss ?? 0),
              0,
            );

      return {
        sector,
        holdings: sectorHoldings,
        totalInvestment,
        totalPresentValue,
        totalGainOrLoss,
      };
    },
  );
}