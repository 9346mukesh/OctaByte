import { memo } from "react";
import type { PortfolioHolding } from "../../types/portfolio";

interface PortfolioTableRowProperties {
  holding: PortfolioHolding;
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

function formatQuantity(value: number): string {
  return value.toLocaleString("en-IN");
}

function formatDecimal(
  value: number | null,
): string {
  if (value === null) {
    return "—";
  }

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercentage(
  value: number | null,
): string {
  if (value === null) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
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

export default memo(function PortfolioTableRow({
  holding,
}: PortfolioTableRowProperties) {
  const gainOrLossClassName =
    getGainOrLossClassName(
      holding.gainOrLoss,
    );

  const dataStatus =
    holding.dataStatus === "available"
      ? ""
      : " opacity-60";

  return (
    <tr className={`border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900${dataStatus}`}>
      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">
        <div>
          <p>{holding.stockName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {holding.marketSymbol}
          </p>
        </div>
      </td>

      <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
        {formatQuantity(holding.quantity)}
      </td>

      <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
        {formatCurrency(holding.purchasePrice)}
      </td>

      <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
        {formatCurrency(holding.investment)}
      </td>

      <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
        {formatPercentage(
          holding.portfolioWeightPercentage,
        )}
      </td>

      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            holding.exchange === "NSE"
              ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          {holding.exchange}
        </span>
      </td>

      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-50">
        {formatCurrency(
          holding.currentMarketPrice,
        )}
      </td>

      <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-slate-50">
        {formatCurrency(holding.presentValue)}
      </td>

      <td
        className={`px-4 py-3 text-right font-mono ${gainOrLossClassName}`}
      >
        {formatCurrency(holding.gainOrLoss)}
      </td>

      <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
        {formatDecimal(
          holding.priceToEarningsRatio,
        )}
      </td>

      <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
        {formatDecimal(
          holding.latestEarningsPerShare,
        )}
      </td>
    </tr>
  );
});