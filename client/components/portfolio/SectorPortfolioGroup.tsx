import type { SectorPortfolioGroup as SectorPortfolioGroupData } from "../../lib/portfolio/sectorCalculations";
import PortfolioTableRow from "./PortfolioTableRow";

interface SectorPortfolioGroupProperties {
  sectorGroup: SectorPortfolioGroupData;
}

function formatCurrency(
  value: number | null,
): string {
  if (value === null) {
    return "—";
  }

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getGainOrLossClassName(
  gainOrLoss: number | null,
): string {
  if (gainOrLoss === null) {
    return "text-slate-500 dark:text-slate-400";
  }

  if (gainOrLoss > 0) {
    return "text-emerald-600 dark:text-emerald-400 font-semibold";
  }

  if (gainOrLoss < 0) {
    return "text-rose-600 dark:text-rose-400 font-semibold";
  }

  return "text-slate-600 dark:text-slate-300";
}

export default function SectorPortfolioGroup({
  sectorGroup,
}: SectorPortfolioGroupProperties) {
  const gainOrLossClassName =
    getGainOrLossClassName(
      sectorGroup.totalGainOrLoss,
    );

  return (
    <>
      <tr className="bg-slate-100 dark:bg-slate-800">
        <td
          colSpan={11}
          className="px-4 py-3 text-left text-sm font-bold text-slate-900 dark:text-slate-50"
        >
          {sectorGroup.sector}
          <span className="ml-2 text-xs font-normal text-slate-600 dark:text-slate-400">
            {sectorGroup.holdings.length} stock
            {sectorGroup.holdings.length !== 1
              ? "s"
              : ""}
          </span>
        </td>
      </tr>

      {sectorGroup.holdings.map(
        (holding) => (
          <PortfolioTableRow
            key={holding.id}
            holding={holding}
          />
        ),
      )}

      <tr className="border-b border-slate-200 border-t border-slate-300 bg-slate-50 font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <td className="px-4 py-3">
          {sectorGroup.sector} • Summary
        </td>

        <td />

        <td />

        <td className="px-4 py-3 text-right font-mono">
          {formatCurrency(
            sectorGroup.totalInvestment,
          )}
        </td>

        <td />

        <td />

        <td />

        <td className="px-4 py-3 text-right font-mono">
          {formatCurrency(
            sectorGroup.totalPresentValue,
          )}
        </td>

        <td
          className={`px-4 py-3 text-right font-mono ${gainOrLossClassName}`}
        >
          {formatCurrency(
            sectorGroup.totalGainOrLoss,
          )}
        </td>

        <td />

        <td />
      </tr>
    </>
  );
}