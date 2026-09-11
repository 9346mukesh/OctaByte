"use client";

import { useState, useCallback } from "react";
import PortfolioEmptyState from "./PortfolioEmptyState";
import PortfolioErrorState from "./PortfolioErrorState";
import PortfolioLoadingState from "./PortfolioLoadingState";
import PortfolioTable from "./PortfolioTable";
import PortfolioMetricsCard from "./PortfolioMetricsCard";
import SectorFilter from "./SectorFilter";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { calculatePortfolioSummary } from "../../lib/portfolio/portfolioSummaryCalculations";

export default function PortfolioDashboard() {
  const {
    portfolioData,
    isLoading,
    isRefreshing,
    errorMessage,
    refreshPortfolioData,
    lastUpdated,
  } = usePortfolioData();

  const [selectedSectors, setSelectedSectors] =
    useState<Set<string | null>>(new Set());

  const handleSectorChange = useCallback(
    (sector: string | null, selected: boolean) => {
      setSelectedSectors((prev) => {
        const updated = new Set(prev);

        if (sector === null) {
          // "All Sectors" clicked
          updated.clear();
        } else if (selected) {
          updated.add(sector);
        } else {
          updated.delete(sector);
        }

        return updated;
      });
    },
    [],
  );

  const filteredHoldings =
    selectedSectors.size === 0
      ? portfolioData?.holdings ?? []
      : portfolioData?.holdings.filter((h) =>
          selectedSectors.has(h.sector),
        ) ?? [];

  if (isLoading) {
    return <PortfolioLoadingState />;
  }

  if (
    errorMessage !== null &&
    portfolioData === null
  ) {
    return (
      <PortfolioErrorState
        errorMessage={errorMessage}
        onRetry={refreshPortfolioData}
      />
    );
  }

  if (
    portfolioData === null ||
    portfolioData.holdings.length === 0
  ) {
    return <PortfolioEmptyState />;
  }

  const portfolioSummary =
    calculatePortfolioSummary(portfolioData.holdings);

  return (
    <main className="min-h-full bg-transparent text-slate-100">
      <div className="border-b border-slate-800/80 bg-slate-950/80 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400 font-mono text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(139,124,255,0.35)]">O</div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">OctaByte</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Portfolio terminal</p>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-xs font-medium text-slate-500 md:flex" aria-label="Primary navigation">
            <span className="text-white">Overview</span>
            <span>Markets</span>
            <span>Activity</span>
          </nav>
          <button
            onClick={refreshPortfolioData}
            disabled={isRefreshing}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-violet-400 hover:text-white disabled:opacity-50"
            title="Refresh portfolio data"
          >
            {isRefreshing ? "Updating..." : "Refresh data"}
          </button>
        </div>
      </div>

      <div className="border-b border-slate-800/70 px-5 pb-7 pt-8 sm:px-8 sm:pt-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Good morning, investor</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Your portfolio, at a glance.
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
                Follow performance across your holdings with live market signals and a clear view of what is moving your return.
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-mono text-xs text-slate-500">MARKET STATUS</p>
              <p className="mt-1 flex items-center justify-end gap-2 text-sm font-medium text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#50e3a4]" />Live tracking</p>
            </div>
          </div>

          {/* Portfolio Stats Overview */}
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-4">
            <div className="bg-slate-950/80 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-600 dark:text-slate-400">
                Total Holdings
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">
                {portfolioData.holdings.length}
              </p>
            </div>
            <div className="bg-slate-950/80 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-600 dark:text-slate-400">
                Sectors
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">
                {
                  new Set(
                    portfolioData.holdings.map(
                      (h) => h.sector,
                    ),
                  ).size
                }
              </p>
            </div>
            <div className="bg-slate-950/80 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-600 dark:text-slate-400">
                Exchanges
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">
                {new Set(
                  portfolioData.holdings.map(
                    (h) => h.exchange,
                  ),
                ).size === 2
                  ? "NSE + BSE"
                  : "NSE"}
              </p>
            </div>
            <div className="bg-slate-950/80 px-4 py-4">
              <p className="text-xs font-medium uppercase text-slate-600 dark:text-slate-400">
                Data Quality
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">
                {(
                  (portfolioData.holdings.filter(
                    (h) => h.dataStatus === "available",
                  ).length /
                    portfolioData.holdings.length) *
                  100
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10">
        {/* Error Alert */}
        {errorMessage !== null && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <p className="font-medium">⚠️ Latest update failed</p>
            <p className="mt-1 text-xs">
              Showing previous portfolio data. Some
              values may be stale.
            </p>
          </div>
        )}

        {/* Portfolio Metrics Card (Hero Section) */}
        <PortfolioMetricsCard
          summary={portfolioSummary}
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
        />

        {/* Sector Filter */}
        <SectorFilter
          holdings={portfolioData.holdings}
          selectedSectors={selectedSectors}
          onSectorChange={handleSectorChange}
        />

        {/* Holdings Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Holdings
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filteredHoldings.length} of{" "}
                {portfolioData.holdings.length} stocks
                {selectedSectors.size > 0 && " (filtered)"}
              </p>
            </div>
          </div>

          <PortfolioTable
            holdings={filteredHoldings}
          />
        </section>
      </div>
    </main>
  );
}