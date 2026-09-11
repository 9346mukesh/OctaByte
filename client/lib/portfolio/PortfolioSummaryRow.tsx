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
    return "text-gray-500";
  }

  if (gainOrLoss > 0) {
    return "text-green-600";
  }

  if (gainOrLoss < 0) {
    return "text-red-600";
  }

  return "text-gray-600";
}

export default function PortfolioSummaryRow({
  summary,
}: PortfolioSummaryRowProperties) {
  const gainOrLossClassName =
    getGainOrLossClassName(
      summary.totalGainOrLoss,
    );

  return (
    <tr className="border-t-2 border-gray-400 bg-gray-800 font-bold text-white">
      <td className="px-4 py-4">
        Grand Total
      </td>

      <td />

      <td />

      <td className="px-4 py-4 text-right">
        {formatCurrency(
          summary.totalInvestment,
        )}
      </td>

      <td />

      <td />

      <td />

      <td className="px-4 py-4 text-right">
        {formatCurrency(
          summary.totalPresentValue,
        )}
      </td>

      <td
        className={`px-4 py-4 text-right ${gainOrLossClassName}`}
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