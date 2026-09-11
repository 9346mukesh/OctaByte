import type { PortfolioSummary } from "../../lib/portfolio/portfolioSummaryCalculations";

interface PortfolioSummaryRowProperties {
  summary: PortfolioSummary;
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

export default function PortfolioSummaryRow({
  summary,
}: PortfolioSummaryRowProperties) {
  const gainOrLossClassName =
    getGainOrLossClassName(
      summary.totalGainOrLoss,
    );

  return (
    <tr className="border-t-2 border-slate-300 bg-slate-900 font-bold text-white dark:border-slate-700 dark:bg-slate-950">
      <td className="px-4 py-4">
        Portfolio • Grand Total
      </td>

      <td />

      <td />

      <td className="px-4 py-4 text-right font-mono">
        {formatCurrency(
          summary.totalInvestment,
        )}
      </td>

      <td />

      <td />

      <td />

      <td className="px-4 py-4 text-right font-mono">
        {formatCurrency(
          summary.totalPresentValue,
        )}
      </td>

      <td
        className={`px-4 py-4 text-right font-mono ${gainOrLossClassName}`}
      >
        {formatCurrency(
          summary.totalGainOrLoss,
        )}
      </td>

      <td />

      <td />
    </tr>
  );
}