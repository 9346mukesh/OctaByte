"use client";

import type { PortfolioSummary } from "../../lib/portfolio/portfolioSummaryCalculations";

interface PortfolioMetricsCardProperties {
  summary: PortfolioSummary;
  isRefreshing: boolean;
  lastUpdated?: Date | null;
}

function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  if (Math.abs(value) >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }
  if (Math.abs(value) >= 100_000) {
    return `₹${(value / 100_000).toFixed(2)}L`;
  }
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function formatPercentage(value: number | null): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function getReturnPercentage(
  totalInvestment: number,
  totalGainOrLoss: number | null,
): number | null {
  if (
    totalGainOrLoss === null ||
    totalInvestment === 0
  ) {
    return null;
  }
  return (totalGainOrLoss / totalInvestment) * 100;
}

export default function PortfolioMetricsCard({
  summary,
  isRefreshing,
  lastUpdated,
}: PortfolioMetricsCardProperties) {
  const returnPercentage = getReturnPercentage(
    summary.totalInvestment,
    summary.totalGainOrLoss,
  );

  const isPositive =
    summary.totalGainOrLoss !== null &&
    summary.totalGainOrLoss > 0;

  const isNegative =
    summary.totalGainOrLoss !== null &&
    summary.totalGainOrLoss < 0;

  const formattedTimestamp = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/10 sm:p-7">
      {/* Header with title and status */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Performance overview
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {isRefreshing && (
            <>
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-500" />
              <span>Updating...</span>
            </>
          )}
          {!isRefreshing && lastUpdated && (
            <>
              <span>Updated {formattedTimestamp}</span>
            </>
          )}
        </div>
      </div>

      {/* Three key metrics in a grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Total Portfolio Value */}
        <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Total Value
          </p>
          <p
            className={`mt-2 font-mono text-2xl font-bold ${isRefreshing ? "animate-fade-in-number" : ""}`}
          >
            {formatCurrency(
              summary.totalPresentValue,
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Invested:{" "}
            {formatCurrency(
              summary.totalInvestment,
            )}
          </p>
        </div>

        {/* Gain/Loss */}
        <div
          className={`rounded-xl border px-4 py-4 ${
            isPositive
              ? "border-emerald-400/20 bg-emerald-400/10"
              : isNegative
                ? "border-rose-400/20 bg-rose-400/10"
                : "border-slate-700 bg-slate-950"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Gain / Loss
          </p>
          <p
            className={`mt-2 font-mono text-2xl font-bold ${isRefreshing ? "animate-fade-in-number" : ""} ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : isNegative
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {formatCurrency(
              summary.totalGainOrLoss,
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isPositive ? "📈 Profit" : isNegative ? "📉 Loss" : "Neutral"}
          </p>
        </div>

        {/* Return Percentage */}
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Return %
          </p>
          <p
            className={`mt-2 font-mono text-2xl font-bold ${isRefreshing ? "animate-fade-in-number" : ""} ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : isNegative
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {formatPercentage(returnPercentage)}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            From {formatCurrency(summary.totalInvestment)}
          </p>
        </div>
      </div>

      {/* Data quality note */}
      <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 CMP data updated every 15 seconds from
          market sources
        </p>
      </div>
    </div>
  );
}
