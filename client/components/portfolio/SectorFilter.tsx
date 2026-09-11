"use client";

import type { PortfolioHolding } from "../../types/portfolio";

interface SectorFilterProperties {
  holdings: PortfolioHolding[];
  selectedSectors: Set<string | null>;
  onSectorChange: (sector: string | null, selected: boolean) => void;
}

export default function SectorFilter({
  holdings,
  selectedSectors,
  onSectorChange,
}: SectorFilterProperties) {
  // Get unique sectors from holdings
  const sectors = Array.from(
    new Set(holdings.map((h) => h.sector)),
  )
    .filter((s) => s !== null)
    .sort() as string[];

  // Calculate sector statistics
  const sectorStats = sectors.map((sector) => {
    const sectorHoldings = holdings.filter(
      (h) => h.sector === sector,
    );
    const totalInvestment = sectorHoldings.reduce(
      (sum, h) => sum + h.investment,
      0,
    );
    const count = sectorHoldings.length;
    return {
      sector,
      count,
      percentage: (
        (totalInvestment /
          holdings.reduce((sum, h) => sum + h.investment, 0)) *
        100
      ).toFixed(1),
    };
  });

  const allSelected = selectedSectors.size === 0;

  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">
          Browse sectors
        </h3>
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Allocation view</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {/* All sectors button */}
        <button
          onClick={() => {
            onSectorChange(null, true);
          }}
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            allSelected
              ? "bg-violet-400 text-slate-950 shadow-[0_0_18px_rgba(139,124,255,0.25)]"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All Sectors
        </button>

        {/* Individual sector buttons */}
        {sectorStats.map(({ sector, count, percentage }) => {
          const isSelected = selectedSectors.has(
            sector,
          );

          return (
            <button
              key={sector}
              onClick={() => {
                onSectorChange(
                  sector,
                  !isSelected,
                );
              }}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-violet-400 text-slate-950 shadow-[0_0_18px_rgba(139,124,255,0.25)]"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              title={`${count} stock${count !== 1 ? "s" : ""}, ${percentage}% of portfolio`}
            >
              <span>{sector}</span>
              <span
                className={`text-xs ${
                  isSelected
                    ? "text-sky-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
